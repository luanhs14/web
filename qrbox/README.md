# 📦 Sistema de Organização de Mudança

Sistema web completo para organizar caixas de mudança com QR codes, permitindo cadastrar caixas, registrar itens, tirar fotos e buscar rapidamente onde cada coisa está guardada.

## ✨ Funcionalidades

- 📦 **Cadastro de Caixas**: Numere e organize suas caixas com tags de prioridade e fragilidade
- 📋 **Registro de Itens**: Liste todos os itens dentro de cada caixa com fotos e descrições
- 🔍 **Busca Inteligente**: Encontre rapidamente qualquer item em qualquer caixa
- 📱 **QR Codes**: Gere QR codes para cada caixa e acesse os itens pelo celular
- 📸 **Fotos dos Itens**: Tire fotos diretamente do celular ao cadastrar itens
- 🎨 **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- 🖨️ **Impressão Térmica**: Imprima QR codes para colar nas caixas físicas

## 🛠️ Stack Tecnológica

- **Backend**: PHP 8.3+
- **Banco de Dados**: SQLite (sem necessidade de servidor)
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **QR Codes**: QRServer API (gratuita)
- **Servidor**: Apache ou Nginx

## 📋 Requisitos

- PHP 8.0 ou superior
- Extensões PHP:
  - `php-sqlite3` (banco de dados)
  - `php-gd` (manipulação de imagens)
  - `php-mbstring` (strings multi-byte)
- Apache (com mod_rewrite) ou Nginx
- Permissões de escrita na pasta do projeto

## 🚀 Instalação

### 1. Instalar Dependências (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install php8.3-cli php8.3-fpm php8.3-sqlite3 php8.3-gd php8.3-mbstring apache2 libapache2-mod-php8.3
```

### 2. Configurar Apache

```bash
# Habilitar mod_rewrite
sudo a2enmod rewrite

# Habilitar mod_headers (para segurança)
sudo a2enmod headers

# Reiniciar Apache
sudo systemctl restart apache2
```

### 3. Instalar o Sistema

```bash
# Criar pasta do projeto
sudo mkdir -p /var/www/qrbox

# Copiar arquivos (index.php, qr.php, .htaccess)
# ... seus arquivos aqui ...

# Criar pasta de uploads
sudo mkdir -p /var/www/qrbox/uploads

# Definir permissões
sudo chown -R www-data:www-data /var/www/qrbox
sudo chmod -R 755 /var/www/qrbox
sudo chmod -R 775 /var/www/qrbox/uploads
```

### 4. Configurar VirtualHost (Opcional)

Crie `/etc/apache2/sites-available/qrbox.conf`:

```apache
<VirtualHost *:80>
    ServerName qrbox.local
    DocumentRoot /var/www/qrbox

    <Directory /var/www/qrbox>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/qrbox_error.log
    CustomLog ${APACHE_LOG_DIR}/qrbox_access.log combined
</VirtualHost>
```

Ativar o site:

```bash
sudo a2ensite qrbox.conf
sudo systemctl reload apache2

# Adicionar ao /etc/hosts (para teste local)
echo "127.0.0.1 qrbox.local" | sudo tee -a /etc/hosts
```

### 5. Testar a Instalação

Acesse no navegador:
- `http://localhost/qrbox` (se instalou em /var/www/html/qrbox)
- `http://qrbox.local` (se configurou o VirtualHost)

## 🎯 Como Usar

### 1. Criar uma Caixa

1. Clique no botão **+** (canto inferior direito)
2. Preencha:
   - Número/Nome da caixa (ex: "Caixa 01", "Livros")
   - Local de origem (ex: "Quarto", "Cozinha")
   - Marque se é Prioritária ou Frágil
   - Adicione observações se necessário
3. Clique em **Criar Caixa**

### 2. Adicionar Itens

1. Clique em **Ver Detalhes** na caixa desejada
2. Clique em **+ Adicionar Item**
3. Preencha:
   - Nome do item
   - Quantidade
   - Descrição (opcional)
   - Tire uma foto (opcional - no mobile, ativa a câmera)
4. Clique em **Adicionar Item**

### 3. Imprimir QR Code

1. Entre nos detalhes da caixa
2. Veja a seção "QR Code para Impressão"
3. Clique em **Imprimir QR Code**
4. Imprima em uma impressora térmica ou comum
5. Cole o QR code na caixa física

### 4. Escanear QR Code

1. Aponte a câmera do celular para o QR code
2. Toque na notificação que aparecer
3. Veja instantaneamente todos os itens da caixa!

### 5. Buscar Itens

1. Use a barra de busca no topo
2. Digite qualquer palavra (nome da caixa, item, local, etc.)
3. O sistema mostra todas as caixas que contêm o termo

## 📁 Estrutura de Arquivos

```
/var/www/qrbox/
├── index.php          # Aplicação principal (backend + frontend)
├── qr.php            # Gerador de QR codes
├── .htaccess         # Configurações Apache
├── README.md         # Esta documentação
├── boxes.db          # Banco SQLite (criado automaticamente)
└── uploads/          # Fotos dos itens (criado automaticamente)
    └── *.jpg/png
```

## 🔒 Segurança

O sistema implementa várias medidas de segurança:

- ✅ **SQL Injection**: Uso de prepared statements (PDO)
- ✅ **XSS**: Sanitização de saídas com `htmlspecialchars()`
- ✅ **Upload Seguro**: Validação de tipos de arquivo e renomeação
- ✅ **Proteção do Banco**: `.htaccess` bloqueia acesso direto ao `.db`
- ✅ **Headers de Segurança**: X-Frame-Options, X-Content-Type-Options, etc.

## 🐛 Solução de Problemas

### Erro: "Unable to open database file"

```bash
# Verificar permissões
sudo chown -R www-data:www-data /var/www/qrbox
sudo chmod 775 /var/www/qrbox
```

### Erro ao fazer upload de fotos

```bash
# Verificar permissões da pasta uploads
sudo chmod 775 /var/www/qrbox/uploads
sudo chown www-data:www-data /var/www/qrbox/uploads

# Verificar limite de upload no PHP
php -i | grep upload_max_filesize
# Se for muito baixo, edite o .htaccess ou php.ini
```

### QR Code não aparece

- Verifique sua conexão com a internet (usa API externa)
- Certifique-se que `allow_url_fopen` está habilitado no PHP:
  ```bash
  php -i | grep allow_url_fopen
  ```

### Apache não reconhece .htaccess

```bash
# Verificar se AllowOverride está habilitado
sudo nano /etc/apache2/apache2.conf

# Procure por:
<Directory /var/www/>
    AllowOverride All  # <- Deve ser "All", não "None"
</Directory>

# Reiniciar Apache
sudo systemctl restart apache2
```

## 📱 Uso em Mobile

O sistema é 100% responsivo e otimizado para celular:

- ✅ Design adaptável (1 coluna em mobile)
- ✅ Botões grandes e touch-friendly
- ✅ Input de foto ativa a câmera automaticamente
- ✅ QR codes escaneáveis nativamente
- ✅ Interface otimizada para uma mão

### Dica: Adicionar à Tela Inicial (PWA)

No celular, você pode "instalar" o sistema:

1. Abra no navegador (Chrome/Safari)
2. Menu → "Adicionar à tela inicial"
3. Use como se fosse um app!

## 🎨 Personalização

### Alterar Cores

Edite as variáveis CSS no `index.php` (seção `<style>`):

```css
/* Cores principais */
--primary: #3498db;    /* Azul */
--success: #27ae60;    /* Verde */
--danger: #e74c3c;     /* Vermelho */
--secondary: #95a5a6;  /* Cinza */
```

### Alterar Tamanho do QR Code

Edite em `qr.php`:

```php
$qr_size = 300; // Altere para o tamanho desejado (em pixels)
```

## 🔄 Backup e Migração

### Fazer Backup

```bash
# Backup completo (banco + fotos)
sudo tar -czf backup-qrbox-$(date +%Y%m%d).tar.gz /var/www/qrbox/boxes.db /var/www/qrbox/uploads/

# Apenas banco de dados
sudo cp /var/www/qrbox/boxes.db ~/backup-boxes-$(date +%Y%m%d).db
```

### Restaurar Backup

```bash
# Descompactar backup completo
sudo tar -xzf backup-qrbox-20250101.tar.gz -C /

# Ou apenas banco
sudo cp ~/backup-boxes-20250101.db /var/www/qrbox/boxes.db
sudo chown www-data:www-data /var/www/qrbox/boxes.db
```

## 📊 Estatísticas do Banco

```bash
# Ver tamanho do banco
ls -lh /var/www/qrbox/boxes.db

# Acessar banco SQLite (para consultas avançadas)
sqlite3 /var/www/qrbox/boxes.db

# Dentro do SQLite:
.tables                              # Listar tabelas
SELECT COUNT(*) FROM boxes;         # Contar caixas
SELECT COUNT(*) FROM items;         # Contar itens
.quit                               # Sair
```

## 🚀 Melhorias Futuras (Roadmap)

- [ ] Export/Import CSV
- [ ] Múltiplos usuários com autenticação
- [ ] Categorias de caixas
- [ ] Dashboard com estatísticas
- [ ] Histórico de movimentação
- [ ] Compartilhamento de caixas
- [ ] API REST
- [ ] App mobile nativo (React Native)
- [ ] PWA completo com modo offline
- [ ] Suporte a etiquetas/tags customizadas

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 💡 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ para facilitar sua mudança!**

## 🎉 Agradecimentos

- API QRServer por fornecer geração de QR codes gratuita
- Comunidade PHP por manter o SQLite integrado
- Você, por usar este sistema! 📦✨
