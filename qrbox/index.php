<?php
// ========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO
// ========================================

// Iniciar sessão para mensagens
session_start();

// Configuração de erros
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Aumentar limites de upload para aceitar fotos grandes de celular
// O sistema otimiza automaticamente as fotos após o upload
@ini_set('upload_max_filesize', '50M');
@ini_set('post_max_size', '50M');
@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', '300');

// Conexão com SQLite
try {
    $db = new PDO('sqlite:boxes.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Erro ao conectar com o banco de dados: " . $e->getMessage());
}

// Criar tabelas se não existirem
$db->exec("
    CREATE TABLE IF NOT EXISTS boxes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        box_number VARCHAR(50) UNIQUE NOT NULL,
        location VARCHAR(100),
        priority INTEGER DEFAULT 0,
        fragile INTEGER DEFAULT 0,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$db->exec("
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        box_id INTEGER NOT NULL,
        name VARCHAR(200) NOT NULL,
        quantity INTEGER DEFAULT 1,
        description TEXT,
        photo VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE
    )
");

// Criar índices para melhor performance
$db->exec("CREATE INDEX IF NOT EXISTS idx_box_number ON boxes(box_number)");
$db->exec("CREATE INDEX IF NOT EXISTS idx_box_id ON items(box_id)");

// Variáveis para mensagens
$message = '';
$error = '';

// ========================================
// PROCESSAMENTO DE AÇÕES (POST)
// ========================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    try {
        // ADICIONAR CAIXA
        if ($action === 'add_box') {
            $box_number = trim($_POST['box_number'] ?? '');
            $location = trim($_POST['location'] ?? '');
            $priority = isset($_POST['priority']) ? 1 : 0;
            $fragile = isset($_POST['fragile']) ? 1 : 0;
            $notes = trim($_POST['notes'] ?? '');

            if (empty($box_number)) {
                throw new Exception("O número da caixa é obrigatório!");
            }

            $stmt = $db->prepare("INSERT INTO boxes (box_number, location, priority, fragile, notes) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$box_number, $location, $priority, $fragile, $notes]);

            $_SESSION['message'] = "Caixa '{$box_number}' criada com sucesso!";
            header("Location: index.php");
            exit;
        }

        // ADICIONAR ITEM
        elseif ($action === 'add_item') {
            $box_id = intval($_POST['box_id'] ?? 0);
            $item_name = trim($_POST['item_name'] ?? '');
            $quantity = intval($_POST['quantity'] ?? 1);
            $description = trim($_POST['description'] ?? '');
            $photo = null;

            if (empty($item_name)) {
                throw new Exception("O nome do item é obrigatório!");
            }

            // Processar upload de foto
            if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                $file_type = $_FILES['photo']['type'];

                if (in_array($file_type, $allowed)) {
                    $upload_dir = 'uploads/';
                    if (!is_dir($upload_dir)) {
                        mkdir($upload_dir, 0777, true);
                    }

                    // Determinar extensão baseada no tipo
                    $extension = 'jpg'; // Padrão JPEG para otimização
                    if ($file_type === 'image/png') {
                        $extension = 'png';
                    } elseif ($file_type === 'image/gif') {
                        $extension = 'gif';
                    }

                    $photo = $upload_dir . uniqid() . '_' . time() . '.' . $extension;
                    $temp_file = $_FILES['photo']['tmp_name'];

                    // Verificar se o arquivo temporário existe
                    if (!file_exists($temp_file)) {
                        throw new Exception("Arquivo temporário não encontrado!");
                    }

                    // Otimizar e salvar a imagem
                    if (!optimizeImage($temp_file, $photo, 800, 85)) {
                        // Se a otimização falhar, fazer upload normal
                        if (!move_uploaded_file($temp_file, $photo)) {
                            throw new Exception("Erro ao fazer upload da foto!");
                        }
                    }

                    // Verificar se a foto foi realmente salva
                    if (!file_exists($photo)) {
                        $photo = null;
                        throw new Exception("Erro ao salvar a foto no servidor!");
                    }
                } else {
                    throw new Exception("Tipo de arquivo não permitido! Use apenas imagens.");
                }
            } elseif (isset($_FILES['photo']) && $_FILES['photo']['error'] !== UPLOAD_ERR_NO_FILE) {
                // Tratar outros erros de upload
                $error_messages = [
                    UPLOAD_ERR_INI_SIZE => 'O arquivo é muito grande (limite do servidor).',
                    UPLOAD_ERR_FORM_SIZE => 'O arquivo é muito grande (limite do formulário).',
                    UPLOAD_ERR_PARTIAL => 'O upload foi feito parcialmente.',
                    UPLOAD_ERR_NO_TMP_DIR => 'Pasta temporária não encontrada.',
                    UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever o arquivo no disco.',
                    UPLOAD_ERR_EXTENSION => 'Upload bloqueado por extensão PHP.',
                ];
                $error_code = $_FILES['photo']['error'];
                $error_msg = $error_messages[$error_code] ?? "Erro desconhecido no upload (código: $error_code)";
                throw new Exception($error_msg);
            }

            $stmt = $db->prepare("INSERT INTO items (box_id, name, quantity, description, photo) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$box_id, $item_name, $quantity, $description, $photo]);

            $_SESSION['message'] = "Item adicionado com sucesso!";
            header("Location: index.php?view={$box_id}");
            exit;
        }

        // DELETAR CAIXA
        elseif ($action === 'delete_box') {
            $box_id = intval($_POST['box_id'] ?? 0);

            // Buscar e deletar fotos dos itens
            $stmt = $db->prepare("SELECT photo FROM items WHERE box_id = ? AND photo IS NOT NULL");
            $stmt->execute([$box_id]);
            $photos = $stmt->fetchAll(PDO::FETCH_COLUMN);

            foreach ($photos as $photo) {
                if (file_exists($photo)) {
                    unlink($photo);
                }
            }

            // Deletar caixa (CASCADE deleta os itens)
            $stmt = $db->prepare("DELETE FROM boxes WHERE id = ?");
            $stmt->execute([$box_id]);

            $_SESSION['message'] = "Caixa excluída com sucesso!";
            header("Location: index.php");
            exit;
        }

        // DELETAR ITEM
        elseif ($action === 'delete_item') {
            $item_id = intval($_POST['item_id'] ?? 0);
            $box_id = intval($_POST['box_id'] ?? 0);

            // Buscar foto para deletar
            $stmt = $db->prepare("SELECT photo FROM items WHERE id = ?");
            $stmt->execute([$item_id]);
            $photo = $stmt->fetchColumn();

            if ($photo && file_exists($photo)) {
                unlink($photo);
            }

            // Deletar item
            $stmt = $db->prepare("DELETE FROM items WHERE id = ?");
            $stmt->execute([$item_id]);

            $_SESSION['message'] = "Item excluído com sucesso!";
            header("Location: index.php?view={$box_id}");
            exit;
        }

    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'UNIQUE') !== false) {
            $error = "Já existe uma caixa com este número!";
        } else {
            $error = "Erro no banco de dados: " . $e->getMessage();
        }
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

// Recuperar mensagem da sessão
if (isset($_SESSION['message'])) {
    $message = $_SESSION['message'];
    unset($_SESSION['message']);
}

// ========================================
// LÓGICA DE VISUALIZAÇÃO
// ========================================

$view_mode = 'list'; // 'list' ou 'detail'
$search_query = $_GET['search'] ?? '';
$view_box_id = intval($_GET['view'] ?? 0);

// Modo de detalhes da caixa
if ($view_box_id > 0) {
    $view_mode = 'detail';

    // Buscar caixa
    $stmt = $db->prepare("SELECT * FROM boxes WHERE id = ?");
    $stmt->execute([$view_box_id]);
    $box = $stmt->fetch();

    if (!$box) {
        header("Location: index.php");
        exit;
    }

    // Buscar itens da caixa
    $stmt = $db->prepare("SELECT * FROM items WHERE box_id = ? ORDER BY created_at DESC");
    $stmt->execute([$view_box_id]);
    $items = $stmt->fetchAll();
}
// Modo de lista (com busca opcional)
else {
    if (!empty($search_query)) {
        // Busca em caixas e itens
        $search_term = "%{$search_query}%";
        $stmt = $db->prepare("
            SELECT DISTINCT b.*,
                (SELECT COUNT(*) FROM items WHERE box_id = b.id) as item_count
            FROM boxes b
            LEFT JOIN items i ON b.id = i.box_id
            WHERE b.box_number LIKE ?
                OR b.location LIKE ?
                OR b.notes LIKE ?
                OR i.name LIKE ?
                OR i.description LIKE ?
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$search_term, $search_term, $search_term, $search_term, $search_term]);
        $boxes = $stmt->fetchAll();
    } else {
        // Listar todas as caixas
        $stmt = $db->query("
            SELECT b.*,
                (SELECT COUNT(*) FROM items WHERE box_id = b.id) as item_count
            FROM boxes b
            ORDER BY b.created_at DESC
        ");
        $boxes = $stmt->fetchAll();
    }
}

// ========================================
// FUNÇÃO DE OTIMIZAÇÃO DE IMAGENS
// ========================================

/**
 * Otimiza e redimensiona imagem para uso web
 * @param string $source_path Caminho da imagem original
 * @param string $dest_path Caminho de destino
 * @param int $max_width Largura máxima (padrão: 800px)
 * @param int $quality Qualidade JPEG (padrão: 85)
 * @return bool Sucesso da operação
 */
function optimizeImage($source_path, $dest_path, $max_width = 800, $quality = 85) {
    // Obter informações da imagem
    $image_info = getimagesize($source_path);
    if ($image_info === false) {
        return false;
    }

    list($orig_width, $orig_height, $image_type) = $image_info;

    // Criar imagem a partir do arquivo original
    switch ($image_type) {
        case IMAGETYPE_JPEG:
            $source_image = imagecreatefromjpeg($source_path);
            break;
        case IMAGETYPE_PNG:
            $source_image = imagecreatefrompng($source_path);
            break;
        case IMAGETYPE_GIF:
            $source_image = imagecreatefromgif($source_path);
            break;
        case IMAGETYPE_WEBP:
            $source_image = imagecreatefromwebp($source_path);
            break;
        default:
            return false;
    }

    if ($source_image === false) {
        return false;
    }

    // Corrigir orientação EXIF (muito importante para fotos de celular!)
    if ($image_type == IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $exif = @exif_read_data($source_path);
        if ($exif !== false && isset($exif['Orientation'])) {
            $rotated = false;
            switch ($exif['Orientation']) {
                case 3:
                    // Rotacionar 180 graus
                    $rotated = imagerotate($source_image, 180, 0);
                    if ($rotated !== false) {
                        imagedestroy($source_image);
                        $source_image = $rotated;
                    }
                    break;
                case 6:
                    // Rotacionar 90 graus no sentido anti-horário (ou 270 horário)
                    $rotated = imagerotate($source_image, -90, 0);
                    if ($rotated !== false) {
                        imagedestroy($source_image);
                        $source_image = $rotated;
                        // Trocar largura e altura
                        $temp = $orig_width;
                        $orig_width = $orig_height;
                        $orig_height = $temp;
                    }
                    break;
                case 8:
                    // Rotacionar 90 graus no sentido horário (ou -90 anti-horário)
                    $rotated = imagerotate($source_image, 90, 0);
                    if ($rotated !== false) {
                        imagedestroy($source_image);
                        $source_image = $rotated;
                        // Trocar largura e altura
                        $temp = $orig_width;
                        $orig_width = $orig_height;
                        $orig_height = $temp;
                    }
                    break;
            }
        }
    }

    // Se a imagem já é menor que o máximo, apenas copiar com compressão
    if ($orig_width <= $max_width) {
        $new_width = $orig_width;
        $new_height = $orig_height;
    } else {
        // Calcular novas dimensões mantendo proporção
        $new_width = $max_width;
        $new_height = intval(($orig_height / $orig_width) * $new_width);
    }

    // Criar nova imagem redimensionada
    $new_image = imagecreatetruecolor($new_width, $new_height);

    // Preservar transparência para PNG e GIF
    if ($image_type == IMAGETYPE_PNG || $image_type == IMAGETYPE_GIF) {
        imagealphablending($new_image, false);
        imagesavealpha($new_image, true);
        $transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
        imagefilledrectangle($new_image, 0, 0, $new_width, $new_height, $transparent);
    }

    // Redimensionar
    imagecopyresampled($new_image, $source_image, 0, 0, 0, 0, $new_width, $new_height, $orig_width, $orig_height);

    // Salvar imagem otimizada (sempre como JPEG para maior compatibilidade e menor tamanho)
    // Exceto se for PNG com transparência ou GIF
    if ($image_type == IMAGETYPE_PNG) {
        $result = imagepng($new_image, $dest_path, 8); // Compressão PNG (0-9, 9 = máxima)
    } elseif ($image_type == IMAGETYPE_GIF) {
        $result = imagegif($new_image, $dest_path);
    } else {
        // JPEG ou WEBP -> converter para JPEG otimizado
        $result = imagejpeg($new_image, $dest_path, $quality);
    }

    // Liberar memória
    imagedestroy($source_image);
    imagedestroy($new_image);

    return $result;
}

// Função helper para escapar HTML
function e($text) {
    return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📦 QR Box</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }

        /* ========== HEADER ========== */
        .header {
            background: white;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #333;
        }

        .search-bar {
            display: flex;
            gap: 10px;
            max-width: 600px;
        }

        .search-bar input {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .search-bar input:focus {
            outline: none;
            border-color: #3498db;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-primary {
            background: #3498db;
            color: white;
        }

        .btn-primary:hover {
            background: #2980b9;
        }

        .btn-danger {
            background: #e74c3c;
            color: white;
        }

        .btn-danger:hover {
            background: #c0392b;
        }

        .btn-secondary {
            background: #95a5a6;
            color: white;
        }

        .btn-secondary:hover {
            background: #7f8c8d;
        }

        .btn-success {
            background: #27ae60;
            color: white;
        }

        .btn-success:hover {
            background: #229954;
        }

        /* ========== CONTAINER ========== */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px 100px 20px;
        }

        /* ========== ALERTS ========== */
        .alert {
            padding: 15px 20px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        /* ========== GRID DE CAIXAS ========== */
        .boxes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .box-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }

        .box-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .box-number {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 10px;
        }

        .box-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .tag {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .tag-priority {
            background: #ffe4e1;
            color: #d63031;
        }

        .tag-fragile {
            background: #fff3cd;
            color: #856404;
        }

        .box-info {
            margin-bottom: 15px;
            color: #666;
        }

        .box-info-row {
            margin-bottom: 8px;
            display: flex;
            gap: 8px;
        }

        .box-info-label {
            font-weight: 600;
            color: #333;
        }

        .box-notes {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            max-height: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .box-actions {
            display: flex;
            gap: 10px;
        }

        .box-actions .btn {
            flex: 1;
            padding: 10px;
            font-size: 14px;
        }

        /* ========== FAB BUTTON ========== */
        .fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #3498db;
            color: white;
            font-size: 32px;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.3s;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .fab:hover {
            background: #2980b9;
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        /* ========== MODAL ========== */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-header h2 {
            font-size: 24px;
            color: #333;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .modal-close:hover {
            color: #333;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group input[type="file"],
        .form-group textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            font-family: inherit;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
        }

        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .checkbox-group {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .checkbox-item label {
            cursor: pointer;
            margin: 0;
            font-weight: 500;
        }

        /* ========== DETAIL VIEW ========== */
        .detail-header {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .detail-header h2 {
            font-size: 32px;
            color: #3498db;
            margin-bottom: 15px;
        }

        .detail-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .qr-section {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }

        .qr-section h3 {
            margin-bottom: 20px;
            color: #333;
        }

        .qr-code-img {
            max-width: 200px;
            height: auto;
            margin: 20px auto;
            border: 3px solid #e0e0e0;
            border-radius: 8px;
            padding: 10px;
            background: white;
        }

        .qr-box-name {
            font-size: 36px;
            font-weight: bold;
            color: #3498db;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px solid #3498db;
        }

        .items-section {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .items-section h3 {
            margin-bottom: 20px;
            color: #333;
        }

        .items-list {
            display: grid;
            gap: 20px;
        }

        .item-card {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            display: flex;
            gap: 20px;
            transition: all 0.3s;
            background: white;
            align-items: flex-start;
        }

        .item-card:hover {
            border-color: #3498db;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.25);
            transform: translateY(-2px);
        }

        .item-photo {
            flex-shrink: 0;
            position: relative;
        }

        .item-photo img {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .item-photo-placeholder {
            width: 150px;
            height: 150px;
            background: #f0f0f0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: #ccc;
        }

        .item-info {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .item-name {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .item-quantity {
            color: #3498db;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .item-description {
            color: #666;
            margin-bottom: 12px;
            font-size: 15px;
            line-height: 1.5;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .empty-state-text {
            font-size: 18px;
        }

        /* ========== PRINT STYLES ========== */
        @media print {
            /* Configurar tamanho do papel para impressora térmica */
            @page {
                size: 26.7mm 120mm;
                margin: 0;
            }

            body * {
                visibility: hidden;
            }

            .qr-section,
            .qr-section * {
                visibility: visible;
            }

            .qr-section {
                position: absolute;
                top: 0;
                left: 0;
                width: 26.7mm;
                height: 120mm;
                margin: 0;
                padding: 2mm;
                box-shadow: none;
                background: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            /* Esconder botão e instruções na impressão */
            .qr-section .btn,
            .qr-section p,
            .qr-section h3 {
                display: none !important;
            }

            /* Nome da caixa em preto e branco */
            .qr-box-name {
                font-size: 14pt !important;
                font-weight: bold !important;
                color: #000 !important;
                background: white !important;
                border: 2px solid #000 !important;
                padding: 3mm !important;
                margin: 0 0 3mm 0 !important;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
            }

            /* QR Code maior para melhor leitura */
            .qr-code-img {
                max-width: 22mm !important;
                width: 22mm !important;
                height: 22mm !important;
                margin: 0 !important;
                border: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
                background: white !important;
            }
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 24px;
            }

            .boxes-grid {
                grid-template-columns: 1fr;
            }

            .search-bar {
                flex-direction: column;
            }

            .fab {
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                font-size: 28px;
            }

            .modal-content {
                padding: 20px;
            }

            .item-card {
                flex-direction: row;
                padding: 15px;
            }

            .item-photo img,
            .item-photo-placeholder {
                width: 100px;
                height: 100px;
            }

            .item-name {
                font-size: 18px;
            }

            .item-quantity {
                font-size: 14px;
            }

            .item-description {
                font-size: 14px;
            }

            .detail-actions {
                flex-direction: column;
            }

            .detail-actions .btn {
                width: 100%;
            }

            /* Esconder seção de QR code no mobile para melhor foco nos itens */
            .qr-section {
                display: none;
            }

            /* Melhorar cabeçalho de detalhes no mobile */
            .detail-header h2 {
                font-size: 28px;
            }

            /* Destacar itens da caixa */
            .items-section h3 {
                font-size: 20px;
                position: sticky;
                top: 0;
                background: white;
                padding: 15px 0;
                z-index: 10;
                border-bottom: 2px solid #3498db;
            }
        }
    </style>
</head>
<body>

<!-- HEADER -->
<div class="header">
    <h1>📦 QR Box</h1>
    <h2> Sistemas para Organização de Mudança</h2>
    <form method="GET" class="search-bar">
        <input type="text" name="search" placeholder="Buscar caixas ou itens..." value="<?= e($search_query) ?>">
        <button type="submit" class="btn btn-primary">Buscar</button>
        <?php if (!empty($search_query)): ?>
            <a href="index.php" class="btn btn-secondary">Limpar</a>
        <?php endif; ?>
    </form>
</div>

<!-- CONTAINER PRINCIPAL -->
<div class="container">
    <!-- Mensagens -->
    <?php if ($message): ?>
        <div class="alert alert-success"><?= e($message) ?></div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-error"><?= e($error) ?></div>
    <?php endif; ?>

    <?php if ($view_mode === 'list'): ?>
        <!-- MODO LISTA -->
        <?php if (!empty($search_query)): ?>
            <h2 style="margin-bottom: 20px; color: #666;">
                Resultados para: "<?= e($search_query) ?>" (<?= count($boxes) ?> encontrado<?= count($boxes) != 1 ? 's' : '' ?>)
            </h2>
        <?php endif; ?>

        <?php if (empty($boxes)): ?>
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">
                    <?php if (!empty($search_query)): ?>
                        Nenhuma caixa encontrada para "<?= e($search_query) ?>"
                    <?php else: ?>
                        Nenhuma caixa cadastrada ainda.<br>Clique no botão + para criar sua primeira caixa!
                    <?php endif; ?>
                </div>
            </div>
        <?php else: ?>
            <div class="boxes-grid">
                <?php foreach ($boxes as $box): ?>
                    <div class="box-card">
                        <div class="box-number">#<?= e($box['box_number']) ?></div>

                        <?php if ($box['priority'] || $box['fragile']): ?>
                            <div class="box-tags">
                                <?php if ($box['priority']): ?>
                                    <span class="tag tag-priority">⚡ Prioritária</span>
                                <?php endif; ?>
                                <?php if ($box['fragile']): ?>
                                    <span class="tag tag-fragile">⚠️ Frágil</span>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                        <div class="box-info">
                            <?php if ($box['location']): ?>
                                <div class="box-info-row">
                                    <span class="box-info-label">📍 Local:</span>
                                    <span><?= e($box['location']) ?></span>
                                </div>
                            <?php endif; ?>
                            <div class="box-info-row">
                                <span class="box-info-label">📦 Itens:</span>
                                <span><?= $box['item_count'] ?></span>
                            </div>
                        </div>

                        <?php if ($box['notes']): ?>
                            <div class="box-notes"><?= e($box['notes']) ?></div>
                        <?php endif; ?>

                        <div class="box-actions">
                            <a href="?view=<?= $box['id'] ?>" class="btn btn-primary">Ver Detalhes</a>
                            <form method="POST" style="flex: 1;" onsubmit="return confirm('Tem certeza que deseja excluir esta caixa e todos os seus itens?');">
                                <input type="hidden" name="action" value="delete_box">
                                <input type="hidden" name="box_id" value="<?= $box['id'] ?>">
                                <button type="submit" class="btn btn-danger" style="width: 100%;">Excluir</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    <?php else: ?>
        <!-- MODO DETALHES -->
        <div class="detail-header">
            <h2>📦 <?= e($box['box_number']) ?></h2>

            <?php if ($box['priority'] || $box['fragile']): ?>
                <div class="box-tags">
                    <?php if ($box['priority']): ?>
                        <span class="tag tag-priority">⚡ Prioritária</span>
                    <?php endif; ?>
                    <?php if ($box['fragile']): ?>
                        <span class="tag tag-fragile">⚠️ Frágil</span>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <div class="box-info" style="margin-top: 15px;">
                <?php if ($box['location']): ?>
                    <div class="box-info-row">
                        <span class="box-info-label">📍 Local:</span>
                        <span><?= e($box['location']) ?></span>
                    </div>
                <?php endif; ?>
                <?php if ($box['notes']): ?>
                    <div class="box-info-row">
                        <span class="box-info-label">📝 Observações:</span>
                        <span><?= e($box['notes']) ?></span>
                    </div>
                <?php endif; ?>
                <div class="box-info-row">
                    <span class="box-info-label">📦 Total de Itens:</span>
                    <span><strong><?= count($items) ?></strong></span>
                </div>
            </div>

            <div class="detail-actions">
                <a href="index.php" class="btn btn-secondary">← Voltar</a>
                <button onclick="openAddItemModal(<?= $box['id'] ?>)" class="btn btn-success">+ Adicionar Item</button>
            </div>
        </div>

        <!-- QR CODE -->
        <div class="qr-section">
            <h3>QR Code para Impressão</h3>
            <p style="color: #666; margin-bottom: 15px;">
                Imprima este QR code e cole na caixa física. Ao escanear, você verá todos os itens dentro dela.
            </p>
            <div class="qr-box-name">#<?= e($box['box_number']) ?></div>
            <img src="qr.php?box=<?= $box['id'] ?>" alt="QR Code" class="qr-code-img">
            <br>
            <button onclick="window.print()" class="btn btn-primary">🖨️ Imprimir QR Code</button>
        </div>

        <!-- ITENS -->
        <div class="items-section">
            <h3>Itens da Caixa (<?= count($items) ?>)</h3>

            <?php if (empty($items)): ?>
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">
                        Nenhum item cadastrado ainda.<br>Clique em "Adicionar Item" para começar!
                    </div>
                </div>
            <?php else: ?>
                <div class="items-list">
                    <?php foreach ($items as $item): ?>
                        <div class="item-card">
                            <div class="item-photo">
                                <?php if ($item['photo']): ?>
                                    <img src="<?= e($item['photo']) ?>" alt="<?= e($item['name']) ?>">
                                <?php else: ?>
                                    <div class="item-photo-placeholder">📦</div>
                                <?php endif; ?>
                            </div>

                            <div class="item-info">
                                <div class="item-name"><?= e($item['name']) ?></div>
                                <div class="item-quantity">📊 Quantidade: <?= $item['quantity'] ?></div>
                                <?php if ($item['description']): ?>
                                    <div class="item-description">💬 <?= e($item['description']) ?></div>
                                <?php endif; ?>

                                <form method="POST" style="margin-top: auto;" onsubmit="return confirm('Tem certeza que deseja excluir este item?');">
                                    <input type="hidden" name="action" value="delete_item">
                                    <input type="hidden" name="item_id" value="<?= $item['id'] ?>">
                                    <input type="hidden" name="box_id" value="<?= $box['id'] ?>">
                                    <button type="submit" class="btn btn-danger" style="padding: 8px 16px; font-size: 14px;">🗑️ Excluir Item</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<!-- FAB BUTTON (apenas no modo lista) -->
<?php if ($view_mode === 'list'): ?>
    <button class="fab" onclick="openAddBoxModal()">+</button>
<?php endif; ?>

<!-- MODAL: ADICIONAR CAIXA -->
<div id="addBoxModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Nova Caixa</h2>
            <button class="modal-close" onclick="closeModal('addBoxModal')">&times;</button>
        </div>

        <form method="POST">
            <input type="hidden" name="action" value="add_box">

            <div class="form-group">
                <label for="box_number">Número/Nome da Caixa *</label>
                <input type="text" id="box_number" name="box_number" required autofocus>
            </div>

            <div class="form-group">
                <label for="location">Local de Origem</label>
                <input type="text" id="location" name="location" placeholder="Ex: Quarto, Cozinha, Sala...">
            </div>

            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="priority" name="priority">
                    <label for="priority">⚡ Prioritária</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="fragile" name="fragile">
                    <label for="fragile">⚠️ Frágil</label>
                </div>
            </div>

            <div class="form-group">
                <label for="notes">Observações</label>
                <textarea id="notes" name="notes" placeholder="Notas adicionais sobre esta caixa..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Criar Caixa</button>
        </form>
    </div>
</div>

<!-- MODAL: ADICIONAR ITEM -->
<div id="addItemModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Novo Item</h2>
            <button class="modal-close" onclick="closeModal('addItemModal')">&times;</button>
        </div>

        <form method="POST" enctype="multipart/form-data">
            <input type="hidden" name="action" value="add_item">
            <input type="hidden" id="item_box_id" name="box_id" value="<?= $view_box_id ?>">

            <div class="form-group">
                <label for="item_name">Nome do Item *</label>
                <input type="text" id="item_name" name="item_name" required>
            </div>

            <div class="form-group">
                <label for="quantity">Quantidade</label>
                <input type="number" id="quantity" name="quantity" min="1" value="1">
            </div>

            <div class="form-group">
                <label for="description">Descrição</label>
                <textarea id="description" name="description" placeholder="Detalhes adicionais sobre o item..."></textarea>
            </div>

            <div class="form-group">
                <label for="photo">Foto (Opcional)</label>
                <input type="file" id="photo" name="photo" accept="image/*" capture="environment">
            </div>

            <button type="submit" class="btn btn-success" style="width: 100%;">Adicionar Item</button>
        </form>
    </div>
</div>

<script>
// ========================================
// FUNÇÕES DE MODAL
// ========================================

function openAddBoxModal() {
    document.getElementById('addBoxModal').classList.add('active');
    document.getElementById('box_number').focus();
}

function openAddItemModal(boxId) {
    document.getElementById('item_box_id').value = boxId;
    document.getElementById('addItemModal').classList.add('active');
    document.getElementById('item_name').focus();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Fechar modal com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(function(modal) {
            modal.classList.remove('active');
        });
    }
});

// Auto-dismiss de mensagens de sucesso após 5 segundos
setTimeout(function() {
    const successAlerts = document.querySelectorAll('.alert-success');
    successAlerts.forEach(function(alert) {
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(function() {
            alert.remove();
        }, 500);
    });
}, 5000);
</script>

</body>
</html>
