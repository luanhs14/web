from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
import re
from collections import Counter, defaultdict
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import json
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
else:
    logger.warning("Tesseract não encontrado. Verifique a instalação.")

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Base de dados simplificada de jogadores (você pode expandir isso)
# Formato: {'nome_jogador': {'posicao': 'gol|tec|zag|lat|mei|ata', 'preco': float}}
JOGADORES_DB = {
    # Goleiros
    'Rossi': {'posicao': 'gol', 'preco': 8.0},
    'Adriano': {'posicao': 'gol', 'preco': 7.0},
    'C. Miguel': {'posicao': 'gol', 'preco': 6.0},
    # Técnicos
    'F. Luís': {'posicao': 'tec', 'preco': 12.0},
    'Fernando Diniz': {'posicao': 'tec', 'preco': 10.0},
    # Zagueiros
    'L. Pereira': {'posicao': 'zag', 'preco': 15.0},
    'G. Gómez': {'posicao': 'zag', 'preco': 12.0},
    'Murilo': {'posicao': 'zag', 'preco': 10.0},
    # Laterais
    'K. Bruno': {'posicao': 'lat', 'preco': 8.0},
    'William': {'posicao': 'lat', 'preco': 7.0},
    # Meias
    'Arrascaeta': {'posicao': 'mei', 'preco': 18.0},
    'Arrascae': {'posicao': 'mei', 'preco': 18.0},  # Variação OCR
    'M. Pereira': {'posicao': 'mei', 'preco': 15.0},
    'Carrascal': {'posicao': 'mei', 'preco': 12.0},
    # Atacantes
    'V. Roque': {'posicao': 'ata', 'preco': 16.0},
    'V Roque': {'posicao': 'ata', 'preco': 16.0},  # Variação OCR
    'K. Jorge': {'posicao': 'ata', 'preco': 14.0},
    'K Jorge': {'posicao': 'ata', 'preco': 14.0},  # Variação OCR
    'S. Lino': {'posicao': 'ata', 'preco': 12.0},
    'F. López': {'posicao': 'ata', 'preco': 10.0},
    'F López': {'posicao': 'ata', 'preco': 10.0},  # Variação OCR
    'Vitor Roque': {'posicao': 'ata', 'preco': 16.0},
    'Kaio Jorge': {'posicao': 'ata', 'preco': 14.0},
    # Jogadores adicionais da imagem exemplo
    'L. Ortiz': {'posicao': 'zag', 'preco': 7.0},
    'L Ortiz': {'posicao': 'zag', 'preco': 7.0},  # Variação OCR
    'Bruno Pereira Ortiz': {'posicao': 'zag', 'preco': 7.0},  # OCR errado - na verdade é L. Ortiz
    'Piquerez': {'posicao': 'lat', 'preco': 10.0},
    # Mais variações baseadas nos erros do OCR
    'Bruno Pereira': {'posicao': 'zag', 'preco': 15.0},  # Pode ser L. Pereira
    'Pereira': {'posicao': 'zag', 'preco': 15.0},  # Genérico - pode ser L. ou M. Pereira
    # Mais jogadores comuns do Cartola
    'Gabriel': {'posicao': 'gol', 'preco': 8.0},
    'Marcos': {'posicao': 'gol', 'preco': 7.0},
    'Rafael': {'posicao': 'gol', 'preco': 6.0},
    'T. Tchê Tchê': {'posicao': 'mei', 'preco': 12.0},
    'Tchê Tchê': {'posicao': 'mei', 'preco': 12.0},
    'Gerson': {'posicao': 'mei', 'preco': 14.0},
    'Bruno Henrique': {'posicao': 'ata', 'preco': 15.0},
    'B. Henrique': {'posicao': 'ata', 'preco': 15.0},
    'Pedro': {'posicao': 'ata', 'preco': 13.0},
    'Gabigol': {'posicao': 'ata', 'preco': 14.0},
    'Yuri Alberto': {'posicao': 'ata', 'preco': 12.0},
    'Y. Alberto': {'posicao': 'ata', 'preco': 12.0},
    'Calleri': {'posicao': 'ata', 'preco': 13.0},
    'Marquinhos': {'posicao': 'zag', 'preco': 11.0},
    'Arboleda': {'posicao': 'zag', 'preco': 10.0},
    'Fabricio Bruno': {'posicao': 'zag', 'preco': 9.0},
    'F. Bruno': {'posicao': 'zag', 'preco': 9.0},
    'Ayrton Lucas': {'posicao': 'lat', 'preco': 9.0},
    'A. Lucas': {'posicao': 'lat', 'preco': 9.0},
}

# Tenta carregar base de dados de arquivo JSON se existir
try:
    if os.path.exists('players_db.json'):
        with open('players_db.json', 'r', encoding='utf-8') as f:
            db_from_file = json.load(f)
            JOGADORES_DB.update(db_from_file)
except Exception as e:
    print(f"Aviso: Não foi possível carregar players_db.json: {e}")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def normalize_name(name):
    """Normaliza nome para comparação"""
    name = name.lower().strip()
    # Remove acentos básicos
    replacements = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a',
        'é': 'e', 'ê': 'e',
        'í': 'i',
        'ó': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u',
        'ç': 'c'
    }
    for old, new in replacements.items():
        name = name.replace(old, new)
    return name

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
    """Melhora a imagem para OCR"""
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
    width, height = image.size
    if width < 800:
        scale = 800 / width
        new_size = (int(width * scale), int(height * scale))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
    
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

    # Tenta obter legendas em português
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['pt', 'pt-BR', 'pt-PT'])
    except Exception:
        # Tenta inglês se português não estiver disponível
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        except Exception:
            # Tenta qualquer idioma disponível
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            transcript = transcript_list.find_generated_transcript(['pt', 'en']).fetch()

    # Junta todo o texto das legendas
    return ' '.join([entry['text'] for entry in transcript])

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
        
        # Extrai jogadores das legendas
        players = extract_players_from_text(transcript_text)
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
def calculate_lineup():
    """Calcula a escalação final baseada nos jogadores mais escolhidos"""
    data = request.json
    player_data = data.get('player_data', {})
    
    # Agrupa por posição
    by_position = {
        'gol': [],
        'tec': [],
        'zag': [],
        'lat': [],
        'mei': [],
        'ata': []
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
    
    # Ordena por contagem e pega os top N
    lineup = {
        'gol': sorted(by_position['gol'], key=lambda x: x['count'], reverse=True)[:1],
        'tec': sorted(by_position['tec'], key=lambda x: x['count'], reverse=True)[:1],
        'zag': sorted(by_position['zag'], key=lambda x: x['count'], reverse=True)[:2],
        'lat': sorted(by_position['lat'], key=lambda x: x['count'], reverse=True)[:2],
        'mei': sorted(by_position['mei'], key=lambda x: x['count'], reverse=True)[:3],
        'ata': sorted(by_position['ata'], key=lambda x: x['count'], reverse=True)[:3],
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
        'unknown_players': sorted(unknown_players, key=lambda x: x['count'], reverse=True)[:10]
    })

@app.route('/load_players_db', methods=['POST'])
def load_players_db():
    """Endpoint para carregar/atualizar base de dados de jogadores"""
    global JOGADORES_DB

    if not request.json:
        return jsonify({'error': 'Dados JSON não fornecidos'}), 400

    data = request.json
    players = data.get('players', {})

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
            'invalid_players': invalid_players
        }), 400

    JOGADORES_DB.update(players)
    return jsonify({'success': True, 'count': len(JOGADORES_DB)})

if __name__ == '__main__':
    # Em desenvolvimento use: export FLASK_DEBUG=1
    # Em produção, use Gunicorn (não execute este bloco)
    debug_mode = os.getenv('FLASK_DEBUG', '0') == '1'
    app.run(debug=debug_mode, host='127.0.0.1', port=5000)

