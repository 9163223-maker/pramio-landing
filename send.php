<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$cfg = [
    'site_name' => 'PRAMIO',
    'mail_to' => 'hello@pramio.ru',
    'mail_from' => 'no-reply@pramio.ru',
    'tg_key' => '',
    'tg_chat' => '',
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $loaded = include $local;
    if (is_array($loaded)) {
        $cfg = array_merge($cfg, $loaded);
    }
}

$subject = trim((string)($_POST['subject'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'validation_failed']);
    exit;
}

$subject = mb_substr($subject, 0, 120);
$message = mb_substr($message, 0, 3000);

$text = "Новая заявка с сайта {$cfg['site_name']}\n\nТема: {$subject}\nEmail: {$email}\n\nСообщение:\n{$message}";

$mailSubject = '=?UTF-8?B?' . base64_encode('Заявка с сайта PRAMIO: ' . $subject) . '?=';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $cfg['mail_from'],
    'Reply-To: ' . $email,
];

$mailOk = false;
if (!empty($cfg['mail_to'])) {
    $mailOk = @mail($cfg['mail_to'], $mailSubject, $text, implode("\r\n", $headers));
}

$tgOk = false;
if (!empty($cfg['tg_key']) && !empty($cfg['tg_chat'])) {
    $payload = http_build_query([
        'chat_id' => $cfg['tg_chat'],
        'text' => $text,
        'disable_web_page_preview' => '1',
    ]);
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 10,
        ],
    ]);
    $res = @file_get_contents('https://api.telegram.org/bot' . $cfg['tg_key'] . '/sendMessage', false, $ctx);
    $tgOk = $res !== false;
}

if (!$mailOk && !$tgOk) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'delivery_failed']);
    exit;
}

echo json_encode(['ok' => true]);
