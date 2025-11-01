"""
Script auxiliar para atualizar a base de dados de jogadores
Você pode expandir isso com dados da API do Cartola ou importar de CSV/JSON
"""

import requests
import json

# Exemplo de como popular a base de dados
# Você pode buscar dados da API do Cartola ou criar manualmente

PLAYERS_EXAMPLE = {
    # Goleiros
    "Rossi": {"posicao": "gol", "preco": 8.0},
    "Adriano": {"posicao": "gol", "preco": 7.0},
    
    # Técnicos
    "F. Luís": {"posicao": "tec", "preco": 12.0},
    "Fernando Diniz": {"posicao": "tec", "preco": 10.0},
    
    # Zagueiros
    "L. Pereira": {"posicao": "zag", "preco": 15.0},
    "G. Gómez": {"posicao": "zag", "preco": 12.0},
    "Murilo": {"posicao": "zag", "preco": 10.0},
    
    # Laterais
    "K. Bruno": {"posicao": "lat", "preco": 8.0},
    "William": {"posicao": "lat", "preco": 7.0},
    
    # Meias
    "Arrascaeta": {"posicao": "mei", "preco": 18.0},
    "M. Pereira": {"posicao": "mei", "preco": 15.0},
    "Carrascal": {"posicao": "mei", "preco": 12.0},
    
    # Atacantes
    "V. Roque": {"posicao": "ata", "preco": 16.0},
    "K. Jorge": {"posicao": "ata", "preco": 14.0},
    "S. Lino": {"posicao": "ata", "preco": 12.0},
    "F. López": {"posicao": "ata", "preco": 10.0},
}

def update_db_via_api():
    """
    Exemplo de como buscar dados da API do Cartola
    (Ajuste conforme a API real do Cartola)
    """
    try:
        # Exemplo de URL - ajuste conforme necessário
        url = "https://api.cartolafc.globo.com/atletas/mercado"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            players = {}
            
            # Processa os dados da API
            for atleta in data.get('atletas', []):
                nome = atleta.get('apelido') or atleta.get('nome')
                posicao_map = {
                    1: 'gol',
                    2: 'lat',
                    3: 'zag',
                    4: 'mei',
                    5: 'ata',
                    6: 'tec'
                }
                posicao = posicao_map.get(atleta.get('posicao_id'), 'desconhecida')
                preco = atleta.get('preco', 0) / 100  # Geralmente vem em centavos
                
                if nome:
                    players[nome] = {
                        'posicao': posicao,
                        'preco': preco
                    }
            
            return players
    except Exception as e:
        print(f"Erro ao buscar da API: {e}")
        return PLAYERS_EXAMPLE
    
    return PLAYERS_EXAMPLE

def save_to_json(players, filename='players_db.json'):
    """Salva base de dados em JSON"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(players, f, ensure_ascii=False, indent=2)
    print(f"Base de dados salva em {filename} ({len(players)} jogadores)")

if __name__ == '__main__':
    print("Atualizando base de dados de jogadores...")
    
    # Tenta buscar da API, senão usa exemplo
    players = update_db_via_api()
    
    # Salva em JSON
    save_to_json(players)
    
    print("\nPara carregar no sistema:")
    print("1. Execute o servidor (python app.py)")
    print("2. Use o endpoint /load_players_db com POST enviando o JSON")

