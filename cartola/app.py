from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
import re
from collections import Counter, defaultdict
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import json
import logging
from logging.handlers import RotatingFileHandler
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
import threading
import unicodedata
import requests
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['MAX_JSON_SIZE'] = 5 * 1024 * 1024  # 5MB max JSON size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Configurações de processamento de imagem
MAX_IMAGE_PIXELS = 16000000  # 4000x4000 pixels máximo
MIN_IMAGE_WIDTH = 800  # Largura mínima para OCR

# Lock para sincronização da base de dados global
db_lock = threading.Lock()

# Configurar logging com rotação
if not os.path.exists('logs'):
    os.makedirs('logs')

# Handler com rotação (máximo 10MB por arquivo, mantém 5 backups)
file_handler = RotatingFileHandler('logs/cartola.log', maxBytes=10485760, backupCount=5, encoding='utf-8')
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))

# Handler para console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))

# Configurar logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Configuração do Tesseract (ajuste se necessário)
# Para Linux/Mac, geralmente funciona sem configuração
# Para Windows, você pode precisar:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Tenta encontrar tesseract automaticamente
import shutil
# Caminhos comuns do tesseract
possible_paths = [
    '/usr/bin/tesseract',
    '/usr/local/bin/tesseract',
    shutil.which('tesseract')
]

tesseract_cmd = None
for path in possible_paths:
    if path and os.path.exists(path):
        tesseract_cmd = path
        break

if tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
    logger.info(f"Tesseract encontrado em: {tesseract_cmd}")

    # Verifica se o idioma português está instalado
    try:
        available_langs = pytesseract.get_languages(config='')
        if 'por' in available_langs:
            logger.info("Idioma português disponível no Tesseract")
        else:
            logger.warning("AVISO: Idioma português NÃO instalado no Tesseract. Instale com: sudo apt-get install tesseract-ocr-por")
    except Exception as e:
        logger.warning(f"Não foi possível verificar idiomas do Tesseract: {e}")
else:
    logger.warning("Tesseract não encontrado. Verifique a instalação.")

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Base de dados de jogadores
# NOTA: Esta base é carregada automaticamente da API oficial do Cartola FC
# Esta seção serve apenas como fallback caso a API esteja indisponível
# A API carrega 746+ jogadores atualizados automaticamente a cada 6 horas
JOGADORES_DB = {}

# Tenta carregar base de dados de arquivo JSON se existir
def load_players_database():
    """Carrega base de dados de jogadores de arquivo JSON com validação robusta"""
    if not os.path.exists('players_db.json'):
        logger.info("Arquivo players_db.json não encontrado, usando base de dados padrão")
        return {}

    try:
        # Verifica tamanho do arquivo
        file_size = os.path.getsize('players_db.json')
        if file_size > app.config['MAX_JSON_SIZE']:
            logger.error(f"Arquivo players_db.json muito grande ({file_size} bytes). Limite: {app.config['MAX_JSON_SIZE']} bytes")
            return {}

        # Carrega e valida JSON
        with open('players_db.json', 'r', encoding='utf-8') as f:
            db_from_file = json.load(f)

        # Valida estrutura
        if not isinstance(db_from_file, dict):
            logger.error("Arquivo players_db.json deve conter um objeto JSON (dicionário)")
            return {}

        # Valida cada jogador
        valid_positions = {'gol', 'zag', 'lat', 'mei', 'ata', 'tec'}
        validated_players = {}
        invalid_count = 0

        for name, info in db_from_file.items():
            if not isinstance(info, dict):
                invalid_count += 1
                continue

            if 'posicao' not in info or 'preco' not in info:
                invalid_count += 1
                continue

            if info['posicao'] not in valid_positions:
                invalid_count += 1
                continue

            try:
                float(info['preco'])
                validated_players[name] = info
            except (TypeError, ValueError):
                invalid_count += 1

        if invalid_count > 0:
            logger.warning(f"{invalid_count} jogadores inválidos ignorados de players_db.json")

        logger.info(f"Base de dados carregada com sucesso: {len(validated_players)} jogadores de players_db.json")
        return validated_players

    except json.JSONDecodeError as e:
        logger.error(f"Erro ao decodificar players_db.json: {e}")
        return {}
    except Exception as e:
        logger.error(f"Erro inesperado ao carregar players_db.json: {e}")
        return {}

def load_players_from_cartola_api():
    """Carrega jogadores diretamente da API do Cartola FC com cache"""
    cache_file = 'cartola_api_cache.json'
    cache_duration = timedelta(hours=6)  # Atualiza a cada 6 horas

    # Mapeamento de IDs de posição para abreviações
    posicoes_map = {
        1: 'gol',
        2: 'lat',
        3: 'zag',
        4: 'mei',
        5: 'ata',
        6: 'tec'
    }

    # Verifica se existe cache válido
    if os.path.exists(cache_file):
        try:
            file_time = datetime.fromtimestamp(os.path.getmtime(cache_file))
            if datetime.now() - file_time < cache_duration:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cached_data = json.load(f)
                    logger.info(f"✅ Usando cache da API Cartola FC: {len(cached_data)} jogadores (cache válido por mais {cache_duration - (datetime.now() - file_time)})")
                    return cached_data
        except Exception as e:
            logger.warning(f"Erro ao ler cache: {e}")

    # Busca dados da API
    try:
        logger.info("📡 Buscando jogadores da API do Cartola FC...")
        response = requests.get('https://api.cartolafc.globo.com/atletas/mercado', timeout=15)
        response.raise_for_status()
        data = response.json()

        atletas = data.get('atletas', [])
        players_db = {}

        for atleta in atletas:
            nome = atleta.get('apelido', '').strip()
            posicao_id = atleta.get('posicao_id')
            preco = atleta.get('preco_num', 0.0)

            # Pula jogadores sem nome ou posição
            if not nome or posicao_id not in posicoes_map:
                continue

            posicao = posicoes_map[posicao_id]

            # Adiciona ao banco de dados
            players_db[nome] = {
                'posicao': posicao,
                'preco': float(preco)
            }

        # Salva cache
        try:
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(players_db, f, ensure_ascii=False, indent=2)
            logger.info(f"✅ {len(players_db)} jogadores carregados da API e salvos em cache!")
        except Exception as e:
            logger.warning(f"Não foi possível salvar cache: {e}")

        return players_db

    except requests.RequestException as e:
        logger.error(f"❌ Erro ao buscar da API do Cartola FC: {e}")

        # Tenta usar cache antigo se existir
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cached_data = json.load(f)
                    logger.warning(f"⚠️ Usando cache antigo: {len(cached_data)} jogadores")
                    return cached_data
            except Exception:
                pass

        return {}
    except Exception as e:
        logger.error(f"❌ Erro inesperado ao carregar da API: {e}")
        return {}

# Carrega jogadores da API do Cartola FC
api_players = load_players_from_cartola_api()
JOGADORES_DB.update(api_players)

# Carrega base de dados externa (arquivo JSON personalizado)
external_db = load_players_database()
JOGADORES_DB.update(external_db)

# Rate limiting simples baseado em memória
from collections import defaultdict
from time import time
from functools import wraps

# Estrutura: {ip: [(timestamp1, endpoint1), (timestamp2, endpoint2), ...]}
request_history = defaultdict(list)
RATE_LIMIT_REQUESTS = 30  # Máximo de requisições
RATE_LIMIT_WINDOW = 60    # Janela de tempo em segundos (1 minuto)
rate_limit_lock = threading.Lock()

def rate_limit(f):
    """Decorador para limitar taxa de requisições por IP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Obtém IP do cliente
        if request.headers.get('X-Forwarded-For'):
            client_ip = request.headers.get('X-Forwarded-For').split(',')[0]
        else:
            client_ip = request.remote_addr or 'unknown'

        current_time = time()
        endpoint = request.endpoint or 'unknown'

        with rate_limit_lock:
            # Remove requisições antigas (fora da janela de tempo)
            request_history[client_ip] = [
                (ts, ep) for ts, ep in request_history[client_ip]
                if current_time - ts < RATE_LIMIT_WINDOW
            ]

            # Conta requisições na janela de tempo
            recent_requests = len(request_history[client_ip])

            if recent_requests >= RATE_LIMIT_REQUESTS:
                logger.warning(f"Rate limit excedido para IP {client_ip} no endpoint {endpoint}")
                return jsonify({
                    'error': 'Muitas requisições. Tente novamente em alguns instantes.',
                    'retry_after': RATE_LIMIT_WINDOW
                }), 429

            # Adiciona requisição atual ao histórico
            request_history[client_ip].append((current_time, endpoint))

        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def normalize_name(name):
    """Normaliza nome para comparação removendo todos os acentos e caracteres especiais"""
    name = name.lower().strip()

    # Remove acentos usando unicodedata (método robusto que cobre todos os caracteres)
    # NFD = Normalização de Forma Canônica Decomposta
    # Remove combining characters (acentos, til, cedilha, etc)
    nfd = unicodedata.normalize('NFD', name)
    name = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')

    # Substitui caracteres especiais manualmente que não são marcas combinadas
    replacements = {
        'ø': 'o',  # Norueguês
        'ð': 'd',  # Islandês
        'þ': 'th', # Islandês
        'ß': 'ss', # Alemão
        'æ': 'ae', # Dinamarquês/Norueguês
        'œ': 'oe', # Francês
    }
    for old, new in replacements.items():
        name = name.replace(old, new)

    return name

def extract_players_from_youtube_text(text, jogadores_db):
    """Extrai nomes de jogadores ESCALADOS do texto de legendas do YouTube

    Usa análise HÍBRIDA:
    1. CONTEXTO: Busca frases-chave de escalação positiva
    2. FREQUÊNCIA: Se mencionado 3+ vezes, provavelmente foi escalado
    3. FILTRO NEGATIVO: Ignora contexto negativo (não vou, evitar, fora, etc)
    """

    # Normaliza o texto
    text_normalized = normalize_name(text)
    text_lower = text.lower()

    # Divide em sentenças para análise de contexto
    sentences = re.split(r'[.!?\n]+', text_lower)

    # Palavras-chave POSITIVAS (indicam escalação)
    positive_keywords = [
        'vou escalar', 'vou de', 'vou com', 'recomendo', 'recomendacao',
        'boa opcao', 'vai bem', 'meu time', 'minha escalacao', 'escolhi',
        'botei', 'coloquei', 'destaque', 'aposta', 'certeza', 'confio',
        'gosto', 'vale a pena', 'pode ir', 'pode escalar', 'tranquilo',
        'seguro', 'mandatario', 'obrigatorio', 'essencial', 'fundamental'
    ]

    # Palavras-chave NEGATIVAS (indicam NÃO escalação)
    negative_keywords = [
        'nao vou', 'nao recomendo', 'evitar', 'fora', 'tirei', 'evito',
        'cuidado', 'risco', 'duvida', 'talvez', 'incerto', 'banco',
        'suplente', 'desfalque', 'lesionado', 'suspenso', 'nao vale',
        'caro demais', 'muito caro', 'nao compensa'
    ]

    players_found = []
    counted_players = set()

    # Percorre todos os jogadores da base de dados
    for player_name, player_info in jogadores_db.items():
        player_normalized = normalize_name(player_name)
        player_lower = player_name.lower()

        # Pula se já contamos esse jogador
        if player_normalized in counted_players:
            continue

        # PASSO 1: Conta quantas vezes o jogador é mencionado
        pattern = r'\b' + re.escape(player_normalized) + r'\b'
        matches = re.findall(pattern, text_normalized)
        mention_count = len(matches)

        # Se não encontrou pelo nome completo, tenta pelo sobrenome
        if mention_count == 0:
            name_parts = player_name.split()
            if len(name_parts) > 1:
                last_name = name_parts[-1]
                if len(last_name) >= 5:
                    last_name_normalized = normalize_name(last_name)
                    pattern = r'\b' + re.escape(last_name_normalized) + r'\b'
                    matches = re.findall(pattern, text_normalized)
                    mention_count = len(matches)

        # Se não foi mencionado, pula
        if mention_count == 0:
            continue

        # PASSO 2: Análise de contexto
        positive_context = 0
        negative_context = 0

        for sentence in sentences:
            # Verifica se o jogador está nesta sentença
            if player_normalized in normalize_name(sentence) or player_lower in sentence:
                # Conta contexto positivo
                for keyword in positive_keywords:
                    if keyword in sentence:
                        positive_context += 1

                # Conta contexto negativo
                for keyword in negative_keywords:
                    if keyword in sentence:
                        negative_context += 1

        # PASSO 3: DECISÃO HÍBRIDA
        # Critérios para considerar ESCALADO:
        is_escalated = False

        # Critério 1: Contexto positivo explícito (palavras-chave)
        if positive_context > 0 and negative_context == 0:
            is_escalated = True

        # Critério 2: Mencionado 3+ vezes SEM contexto negativo (frequência alta)
        elif mention_count >= 3 and negative_context == 0:
            is_escalated = True

        # Critério 3: Mencionado 5+ vezes mesmo com algum contexto negativo
        # (provavelmente foi muito discutido = escalado)
        elif mention_count >= 5 and negative_context <= 1:
            is_escalated = True

        # Se foi considerado escalado, adiciona à lista
        if is_escalated:
            players_found.append(player_name)
            counted_players.add(player_normalized)

    return players_found

def extract_players_from_text(text):
    """Extrai nomes de jogadores do texto OCR ou legendas"""
    lines = text.split('\n')
    players = []
    
    # Palavras a ignorar (palavras comuns que não são nomes de jogadores)
    ignore_words = {'cartola', 'cartoletas', 'c$', 'preco', 'preço', 'rodada',
                   'escalacao', 'escalação', 'time', 'gol', 'ata', 'mei', 'zag',
                   'lat', 'tec', 'pal', 'cru', 'fla', 'atletico', 'flamengo',
                   'palmeiras', 'cruzeiro', 'sao paulo', 'corinthians',
                   'qto', 'uma', 'qilr', 'qt', 'mult', 'flu', 'migul', 'wit'}  # Palavras soltas que aparecem no OCR errado
    
    # Palavras muito curtas que geralmente são erros do OCR
    invalid_short_words = {'qto', 'uma', 'qil', 'qt', 'fl', 'mg', 'br'}
    
    # Padrões de nomes de jogadores (geralmente começam com letra maiúscula)
    player_pattern = re.compile(r'^[A-ZÁÉÍÓÚÇ][a-záéíóúç]*(?:\s+[A-ZÁÉÍÓÚÇ][a-záéíóúç]*\.?)?(?:\s+[A-ZÁÉÍÓÚÇ][a-záéíóúç]+)?')
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 3:
            continue
        
        # Remove caracteres especiais mantendo pontos e espaços
        cleaned_line = re.sub(r'[^\w\s\.\u00C0-\u017F]', '', line)
        
        # Remove números isolados e valores monetários
        cleaned_line = re.sub(r'\b\d+[\.,]\d+\b', '', cleaned_line)  # Remove preços
        cleaned_line = re.sub(r'\bC\$\s*\d+', '', cleaned_line)  # Remove C$12.45
        cleaned_line = re.sub(r'\b\d+\b', '', cleaned_line)  # Remove números soltos
        
        # Divide em palavras
        words = cleaned_line.split()
        
        # Filtra palavras a ignorar
        filtered_words = [w for w in words if w.lower() not in ignore_words and len(w) >= 2]
        
        if not filtered_words:
            continue
        
        # Tenta identificar padrões de nomes
        # Nomes geralmente: "V. Roque", "Arrascaeta", "F. López", etc
        potential_name = ' '.join(filtered_words[:3])  # Até 3 palavras
        
        # Validação: deve ter pelo menos 3 caracteres e começar com letra
        if len(potential_name) >= 3 and potential_name[0].isalpha():
            # Remove palavras muito curtas que não fazem sentido no meio do nome
            name_parts = potential_name.split()
            valid_parts = []
            for part in name_parts:
                # Aceita abreviações (1-2 letras com ponto) ou nomes normais (3+ letras)
                if (len(part) == 1 and part.isalpha()) or \
                   (len(part) == 2 and part.endswith('.')) or \
                   (len(part) >= 3):
                    valid_parts.append(part)
            
            if valid_parts:
                final_name = ' '.join(valid_parts)
                # Normaliza espaços múltiplos
                final_name = re.sub(r'\s+', ' ', final_name).strip()
                if len(final_name) >= 3 and len(final_name) <= 40:
                    players.append(final_name)
    
    # Remove duplicatas mantendo ordem
    seen = set()
    unique_players = []
    for p in players:
        normalized = normalize_name(p)
        # Filtra palavras muito curtas ou que são claramente erros
        words = normalized.split()
        # Se todas as palavras são muito curtas (menos de 3 letras), provavelmente é erro
        if all(len(w) < 3 for w in words) and len(words) > 1:
            continue
        # Ignora palavras soltas que são erros comuns do OCR
        if any(w in invalid_short_words for w in words):
            continue
        
        if normalized not in seen and normalized:
            seen.add(normalized)
            unique_players.append(p)
    
    return unique_players

def match_player(name, jogadores_db):
    """Tenta fazer match de um nome com a base de dados - múltiplas estratégias"""
    normalized_input = normalize_name(name)
    
    # Remove pontos e espaços extras para matching mais flexível
    normalized_input_clean = re.sub(r'[.\s]+', '', normalized_input)
    
    # Estratégia 1: Busca exata
    for db_name, info in jogadores_db.items():
        if normalize_name(db_name) == normalized_input:
            return db_name, info
    
    # Estratégia 2: Busca exata sem pontos e espaços
    for db_name, info in jogadores_db.items():
        db_normalized_clean = re.sub(r'[.\s]+', '', normalize_name(db_name))
        if db_normalized_clean == normalized_input_clean:
            return db_name, info
    
    # Estratégia 3: Busca parcial (contém) - mais permissiva
    for db_name, info in jogadores_db.items():
        db_normalized = normalize_name(db_name)
        db_normalized_clean = re.sub(r'[.\s]+', '', db_normalized)
        
        # Se um contém o outro (com tolerância)
        if (db_normalized in normalized_input or normalized_input in db_normalized) or \
           (db_normalized_clean in normalized_input_clean or normalized_input_clean in db_normalized_clean):
            # Mas ignora matches muito curtos (menos de 3 caracteres)
            if len(db_normalized.replace(' ', '')) >= 3:
                return db_name, info
    
    # Estratégia 4: Match por iniciais e última palavra (ex: "V Roque" = "V. Roque" ou "Vitor Roque")
    input_words = normalized_input.split()
    if len(input_words) >= 2:
        for db_name, info in jogadores_db.items():
            db_words = normalize_name(db_name).split()
            if len(db_words) >= 2:
                # Primeira palavra deve começar com mesma letra (ou ser abreviação)
                first_match = (input_words[0][0] == db_words[0][0]) if input_words[0] and db_words[0] else False
                # Última palavra deve ser similar
                last_match = input_words[-1] == db_words[-1] or \
                           (len(input_words[-1]) >= 4 and input_words[-1] in db_words[-1]) or \
                           (len(db_words[-1]) >= 4 and db_words[-1] in input_words[-1])
                
                if first_match and last_match:
                    return db_name, info
    
    # Estratégia 5: Match por similaridade de strings (Levenshtein simplificado)
    # Se uma string contém a maioria das letras da outra
    for db_name, info in jogadores_db.items():
        db_normalized = normalize_name(db_name).replace(' ', '').replace('.', '')
        input_clean = normalized_input.replace(' ', '').replace('.', '')
        
        # Se uma é substring significativa da outra
        if len(db_normalized) >= 4 and len(input_clean) >= 4:
            if db_normalized in input_clean or input_clean in db_normalized:
                # Verifica se pelo menos 70% dos caracteres coincidem
                common_chars = sum(1 for c in set(input_clean) if c in db_normalized)
                similarity = common_chars / max(len(set(input_clean)), len(set(db_normalized)))
                if similarity >= 0.7:
                    return db_name, info
    
    return None, None

def preprocess_image(image):
    """Melhora a imagem para OCR com controle de memória"""
    width, height = image.size
    pixels = width * height

    # PROTEÇÃO DE MEMÓRIA: Redimensiona imagens muito grandes
    if pixels > MAX_IMAGE_PIXELS:
        # Calcula escala para reduzir até o limite
        scale = (MAX_IMAGE_PIXELS / pixels) ** 0.5
        new_width = int(width * scale)
        new_height = int(height * scale)
        logger.warning(f"Imagem muito grande ({width}x{height}). Redimensionando para {new_width}x{new_height}")
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        width, height = new_width, new_height

    # Converte para escala de cinza (melhora precisão)
    if image.mode != 'L':
        image = image.convert('L')

    # Aumenta contraste
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.5)

    # Aumenta nitidez
    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(2.0)

    # Redimensiona se muito pequena (melhora OCR)
    if width < MIN_IMAGE_WIDTH:
        scale = MIN_IMAGE_WIDTH / width
        new_size = (int(width * scale), int(height * scale))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
        logger.info(f"Imagem redimensionada de {width}x{height} para {new_size[0]}x{new_size[1]} para melhorar OCR")

    # Aplica filtro para reduzir ruído
    image = image.filter(ImageFilter.MedianFilter(size=3))

    return image

def process_image(image_path):
    """Processa uma imagem e retorna lista de jogadores encontrados"""
    try:
        # Abre a imagem
        image = Image.open(image_path)
        original_size = image.size
        
        # Pré-processa a imagem
        processed_image = preprocess_image(image)
        
        # Configurações do OCR para melhor precisão
        custom_config = r'--oem 3 --psm 6'  # PSM 6 = Assume um único bloco uniforme de texto
        
        # Tenta OCR com português primeiro
        try:
            text = pytesseract.image_to_string(processed_image, lang='por', config=custom_config)
            logger.info(f"OCR Português executado em {image_path}")
        except Exception as e1:
            logger.warning(f"OCR Português falhou: {e1}, tentando inglês...")
            try:
                text = pytesseract.image_to_string(processed_image, lang='eng', config=custom_config)
                logger.info(f"OCR Inglês executado em {image_path}")
            except Exception as e2:
                logger.error(f"OCR falhou completamente: {e2}")
                # Última tentativa sem especificar idioma
                text = pytesseract.image_to_string(processed_image, config=custom_config)
        
        # Log do texto extraído (útil para debug)
        logger.info(f"Texto extraído ({len(text)} chars): {text[:200]}...")
        
        # Extrai jogadores do texto
        players = extract_players_from_text(text)
        logger.info(f"Jogadores extraídos: {players}")
        
        return players, text
    except Exception as e:
        error_msg = f"Erro no OCR: {str(e)}"
        logger.error(error_msg)
        return [], error_msg

def extract_video_id(url):
    """Extrai ID do vídeo do YouTube"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def _get_transcript_internal(video_id):
    """Função interna para obter transcrição (usada com timeout)"""
    from youtube_transcript_api import YouTubeTranscriptApi

    try:
        # Cria instância da API
        api = YouTubeTranscriptApi()

        # Lista transcrições disponíveis
        transcript_list = api.list(video_id)

        # Tenta obter legendas em português primeiro
        try:
            transcript = transcript_list.find_transcript(['pt', 'pt-BR', 'pt-PT'])
            fetched = transcript.fetch()
            return ' '.join([snippet.text for snippet in fetched])
        except Exception:
            pass

        # Tenta inglês se português não estiver disponível
        try:
            transcript = transcript_list.find_transcript(['en', 'en-US', 'en-GB'])
            fetched = transcript.fetch()
            return ' '.join([snippet.text for snippet in fetched])
        except Exception:
            pass

        # Tenta obter qualquer transcrição disponível
        for transcript in transcript_list:
            try:
                fetched = transcript.fetch()
                return ' '.join([snippet.text for snippet in fetched])
            except Exception:
                continue

        raise Exception("Nenhuma transcrição disponível para este vídeo")

    except Exception as e:
        raise Exception(f"Não foi possível obter legendas. Verifique se o vídeo tem legendas disponíveis. Erro: {str(e)}")

def get_youtube_transcript(video_id):
    """Obtém legendas do YouTube com timeout de 30 segundos"""
    try:
        # Usa ThreadPoolExecutor para adicionar timeout
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_get_transcript_internal, video_id)
            text = future.result(timeout=30)  # Timeout de 30 segundos
            return text, None
    except FuturesTimeoutError:
        return None, "Timeout ao tentar obter legendas do YouTube (>30s)"
    except Exception as e:
        return None, str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_youtube', methods=['POST'])
@rate_limit
def process_youtube():
    """Processa links do YouTube extraindo legendas"""
    data = request.json
    urls = data.get('urls', [])
    
    if not urls:
        return jsonify({'error': 'Nenhum link do YouTube enviado'}), 400
    
    all_players = []
    processing_results = []
    
    for url in urls:
        video_id = extract_video_id(url)
        if not video_id:
            processing_results.append({
                'url': url,
                'error': 'URL inválida ou não é do YouTube'
            })
            continue
        
        transcript_text, error = get_youtube_transcript(video_id)
        if error:
            processing_results.append({
                'url': url,
                'video_id': video_id,
                'error': f'Erro ao obter legendas: {error}'
            })
            continue

        # Extrai jogadores das legendas usando função específica para YouTube
        players = extract_players_from_youtube_text(transcript_text, JOGADORES_DB)
        all_players.extend(players)
        
        processing_results.append({
            'url': url,
            'video_id': video_id,
            'players_found': len(players),
            'players': players[:20],
            'transcript_preview': transcript_text[:500] if transcript_text else None
        })
    
    # Agregação (mesma lógica do upload de imagens)
    player_counts = Counter(all_players)
    matched_players = defaultdict(lambda: {'count': 0, 'posicao': None, 'variants': []})
    
    for player_name, count in player_counts.items():
        matched_name, player_info = match_player(player_name, JOGADORES_DB)
        if matched_name:
            matched_players[matched_name]['count'] += count
            matched_players[matched_name]['posicao'] = player_info.get('posicao')
            if player_name not in matched_players[matched_name]['variants']:
                matched_players[matched_name]['variants'].append(player_name)
        else:
            found_similar = False
            for existing_name in matched_players.keys():
                if normalize_name(existing_name) == normalize_name(player_name):
                    matched_players[existing_name]['count'] += count
                    if player_name not in matched_players[existing_name]['variants']:
                        matched_players[existing_name]['variants'].append(player_name)
                    found_similar = True
                    break
            
            if not found_similar:
                matched_players[player_name]['count'] += count
                matched_players[player_name]['posicao'] = 'desconhecida'
                matched_players[player_name]['variants'].append(player_name)
    
    logger.info(f"YouTube - Total de jogadores extraídos: {len(all_players)}")
    
    return jsonify({
        'success': True,
        'processing_results': processing_results,
        'all_players_count': len(all_players),
        'unique_players': len(matched_players),
        'matched_players': {k: dict(v) for k, v in matched_players.items()}
    })

@app.route('/upload', methods=['POST'])
@rate_limit
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    files = request.files.getlist('files')
    
    if not files or files[0].filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    all_players = []
    processing_results = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            players, ocr_text = process_image(filepath)
            # Cada jogador encontrado conta como 1 escolha nesta imagem
            all_players.extend(players)
            
            # Informações de debug adicionais
            ocr_preview = ocr_text[:500] if (ocr_text and isinstance(ocr_text, str) and not ocr_text.startswith('Erro')) else None
            error_msg = ocr_text if (isinstance(ocr_text, str) and ocr_text.startswith('Erro')) else None
            
            processing_results.append({
                'filename': filename,
                'players_found': len(players),
                'players': players[:20],  # Mostra mais jogadores para debug
                'ocr_preview': ocr_preview,
                'error': error_msg
            })
    
    # Agregação por jogador (conta quantas vezes cada jogador aparece)
    # Isso representa quantas vezes cada jogador foi escolhido nas imagens
    player_counts = Counter(all_players)
    
    # Tenta fazer match com base de dados
    matched_players = defaultdict(lambda: {'count': 0, 'posicao': None, 'variants': []})
    
    # Agrupa variações do mesmo jogador (ex: "V. Roque" e "V Roque" são o mesmo)
    for player_name, count in player_counts.items():
        matched_name, player_info = match_player(player_name, JOGADORES_DB)
        if matched_name:
            # Jogador encontrado na DB - agrupa com o nome canônico
            matched_players[matched_name]['count'] += count
            matched_players[matched_name]['posicao'] = player_info.get('posicao')
            if player_name not in matched_players[matched_name]['variants']:
                matched_players[matched_name]['variants'].append(player_name)
        else:
            # Jogador não encontrado - mantém como está mas agrupa variações similares
            # Tenta agrupar variações do mesmo nome
            found_similar = False
            for existing_name in matched_players.keys():
                # Se já existe um nome similar (normalizado), agrupa
                if normalize_name(existing_name) == normalize_name(player_name):
                    matched_players[existing_name]['count'] += count
                    if player_name not in matched_players[existing_name]['variants']:
                        matched_players[existing_name]['variants'].append(player_name)
                    found_similar = True
                    break
            
            if not found_similar:
                # Novo jogador não identificado
                matched_players[player_name]['count'] += count
                matched_players[player_name]['posicao'] = 'desconhecida'
                matched_players[player_name]['variants'].append(player_name)
    
    # Log para debug
    logger.info(f"Total de jogadores extraídos: {len(all_players)}")
    logger.info(f"Jogadores únicos: {len(matched_players)}")
    logger.info(f"Contagens: {dict(player_counts)}")
    
    return jsonify({
        'success': True,
        'processing_results': processing_results,
        'all_players_count': len(all_players),
        'unique_players': len(matched_players),
        'player_counts': dict(player_counts),
        'matched_players': {k: dict(v) for k, v in matched_players.items()},
        'ocr_debug': [{'filename': r['filename'], 'players_preview': r['players']} 
                      for r in processing_results]
    })

@app.route('/calculate_lineup', methods=['POST'])
@rate_limit
def calculate_lineup():
    """Calcula a escalação final baseada nos jogadores mais escolhidos"""
    data = request.json
    player_data = data.get('player_data', {})
    
    # Agrupa por posição (ordem de exibição)
    by_position = {
        'gol': [],
        'zag': [],
        'lat': [],
        'mei': [],
        'ata': [],
        'tec': []
    }
    
    for player_name, info in player_data.items():
        posicao = info.get('posicao', 'desconhecida')
        count = info.get('count', 0)
        
        # Mapeia posições
        if posicao in by_position:
            by_position[posicao].append({
                'nome': player_name,
                'count': count,
                'variants': info.get('variants', [])
            })
    
    # Ordena por contagem decrescente (mostra TODOS os jogadores)
    lineup = {
        'gol': sorted(by_position['gol'], key=lambda x: x['count'], reverse=True),
        'tec': sorted(by_position['tec'], key=lambda x: x['count'], reverse=True),
        'zag': sorted(by_position['zag'], key=lambda x: x['count'], reverse=True),
        'lat': sorted(by_position['lat'], key=lambda x: x['count'], reverse=True),
        'mei': sorted(by_position['mei'], key=lambda x: x['count'], reverse=True),
        'ata': sorted(by_position['ata'], key=lambda x: x['count'], reverse=True),
    }
    
    # Para jogadores sem posição definida, tenta inferir pelo contexto ou lista todos
    unknown_players = []
    for player_name, info in player_data.items():
        if info.get('posicao') == 'desconhecida':
            unknown_players.append({
                'nome': player_name,
                'count': info.get('count', 0),
                'variants': info.get('variants', [])
            })
    
    return jsonify({
        'lineup': lineup,
        'unknown_players': sorted(unknown_players, key=lambda x: x['count'], reverse=True)
    })

@app.route('/load_players_db', methods=['POST'])
@rate_limit
def load_players_db():
    """Endpoint para carregar/atualizar base de dados de jogadores"""
    global JOGADORES_DB

    if not request.json:
        return jsonify({'error': 'Dados JSON não fornecidos'}), 400

    # Verifica tamanho do payload
    content_length = request.content_length
    if content_length and content_length > app.config['MAX_JSON_SIZE']:
        return jsonify({
            'error': f'Payload muito grande. Máximo: {app.config["MAX_JSON_SIZE"]} bytes'
        }), 413

    data = request.json
    players = data.get('players', {})

    if not isinstance(players, dict):
        return jsonify({'error': 'Campo "players" deve ser um dicionário'}), 400

    # Limita quantidade de jogadores por requisição (proteção DoS)
    if len(players) > 10000:
        return jsonify({'error': 'Máximo de 10.000 jogadores por requisição'}), 400

    # Validar estrutura dos dados
    valid_positions = {'gol', 'zag', 'lat', 'mei', 'ata', 'tec'}
    invalid_players = []

    for name, info in players.items():
        if not isinstance(info, dict):
            invalid_players.append(f"{name}: deve ser um dicionário")
            continue

        if 'posicao' not in info:
            invalid_players.append(f"{name}: falta campo 'posicao'")
            continue

        if 'preco' not in info:
            invalid_players.append(f"{name}: falta campo 'preco'")
            continue

        if info['posicao'] not in valid_positions:
            invalid_players.append(f"{name}: posição inválida '{info['posicao']}'")
            continue

        try:
            float(info['preco'])
        except (TypeError, ValueError):
            invalid_players.append(f"{name}: preço deve ser numérico")
            continue

    if invalid_players:
        return jsonify({
            'error': 'Dados inválidos encontrados',
            'invalid_players': invalid_players[:100]  # Limita mensagens de erro
        }), 400

    # PROTEÇÃO CONTRA RACE CONDITION: Usa lock para atualizar base de dados
    with db_lock:
        JOGADORES_DB.update(players)
        total_count = len(JOGADORES_DB)

    logger.info(f"Base de dados atualizada com {len(players)} novos jogadores. Total: {total_count}")
    return jsonify({'success': True, 'count': total_count, 'updated': len(players)})

if __name__ == '__main__':
    # Em desenvolvimento use: export FLASK_DEBUG=1
    # Em produção, use Gunicorn (não execute este bloco)
    debug_mode = os.getenv('FLASK_DEBUG', '0') == '1'
    app.run(debug=debug_mode, host='127.0.0.1', port=5000)

