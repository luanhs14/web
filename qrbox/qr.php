<?php
/**
 * ========================================
 * GERADOR DE QR CODE
 * ========================================
 *
 * Este arquivo gera QR codes para as caixas
 * usando a API externa QRServer
 *
 * Uso: qr.php?box={id}
 */

// Verificar se o parâmetro box foi fornecido
if (!isset($_GET['box']) || empty($_GET['box'])) {
    http_response_code(400);
    die('Parâmetro "box" não fornecido');
}

$box_id = intval($_GET['box']);

if ($box_id <= 0) {
    http_response_code(400);
    die('ID de caixa inválido');
}

// Construir URL completa para a página de detalhes
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$url = $protocol . '://' . $host . '/index.php?view=' . $box_id;

// Gerar QR code usando API externa
// Usando QRServer API (gratuita e sem necessidade de chave)
// Tamanho maior (500px) para melhor qualidade na impressão térmica
$qr_size = 500; // Tamanho em pixels
$qr_url = 'https://api.qrserver.com/v1/create-qr-code/?' . http_build_query([
    'size' => $qr_size . 'x' . $qr_size,
    'data' => $url,
    'format' => 'png',
    'margin' => 5,
    'qzone' => 1,
]);

// Opções de contexto para file_get_contents
$context_options = [
    'http' => [
        'timeout' => 10, // Timeout de 10 segundos
        'user_agent' => 'Mozilla/5.0 (Moving Boxes System)',
    ],
];
$context = stream_context_create($context_options);

// Tentar buscar a imagem do QR code
try {
    $image = @file_get_contents($qr_url, false, $context);

    if ($image === false) {
        throw new Exception('Erro ao gerar QR code');
    }

    // Definir headers para retornar imagem PNG
    header('Content-Type: image/png');
    header('Content-Length: ' . strlen($image));
    header('Cache-Control: public, max-age=86400'); // Cache de 1 dia

    // Enviar a imagem
    echo $image;

} catch (Exception $e) {
    // Em caso de erro, gerar uma imagem de erro
    http_response_code(500);

    // Criar uma imagem de erro simples
    $error_img = imagecreate(300, 300);
    $bg = imagecolorallocate($error_img, 255, 255, 255);
    $text_color = imagecolorallocate($error_img, 255, 0, 0);

    imagestring($error_img, 5, 50, 140, 'Erro ao gerar', $text_color);
    imagestring($error_img, 5, 70, 160, 'QR Code', $text_color);

    header('Content-Type: image/png');
    imagepng($error_img);
    imagedestroy($error_img);
}
