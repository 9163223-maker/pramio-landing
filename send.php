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
    'smtp_host' => 'smtp.spaceweb.ru',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl',
    'smtp_user' => '',
    'smtp_password' => '',
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

function pramio_cut($text, $limit) {
    if (function_exists('mb_substr')) return mb_substr($text, 0, $limit, 'UTF-8');
    return substr($text, 0, $limit);
}

function pramio_header_encode($text) {
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
}

function pramio_read_smtp($socket) {
    $response = '';
    while (!feof($socket)) {
        $line = fgets($socket, 515);
        if ($line === false) break;
        $response .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') break;
    }
    $code = (int)substr($response, 0, 3);
    return [$code, $response];
}

function pramio_smtp_cmd($socket, $cmd, $expected) {
    if ($cmd !== null) {
        fwrite($socket, $cmd . "\r\n");
    }
    list($code, $response) = pramio_read_smtp($socket);
    $expected = (array)$expected;
    if (!in_array($code, $expected, true)) {
        throw new Exception('SMTP error ' . $code . ': ' . trim($response));
    }
    return [$code, $response];
}

function pramio_smtp_send($cfg, $to, $subject, $body, $replyTo) {
    if (empty($cfg['smtp_user']) || empty($cfg['smtp_password'])) {
        throw new Exception('SMTP credentials are empty');
    }

    $host = $cfg['smtp_host'];
    $port = (int)$cfg['smtp_port'];
    $secure = strtolower((string)$cfg['smtp_secure']);
    $from = !empty($cfg['mail_from']) ? $cfg['mail_from'] : $cfg['smtp_user'];
    $siteName = !empty($cfg['site_name']) ? $cfg['site_name'] : 'PRAMIO';

    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid sender or recipient');
    }

    $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);

    $socket = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new Exception('Connection failed: ' . $errstr);
    }
    stream_set_timeout($socket, 15);

    try {
        pramio_smtp_cmd($socket, null, 220);
        pramio_smtp_cmd($socket, 'EHLO ' . ($_SERVER['HTTP_HOST'] ?? 'pramio.ru'), 250);

        if ($secure === 'tls') {
            pramio_smtp_cmd($socket, 'STARTTLS', 220);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new Exception('STARTTLS failed');
            }
            pramio_smtp_cmd($socket, 'EHLO ' . ($_SERVER['HTTP_HOST'] ?? 'pramio.ru'), 250);
        }

        pramio_smtp_cmd($socket, 'AUTH LOGIN', 334);
        pramio_smtp_cmd($socket, base64_encode($cfg['smtp_user']), 334);
        pramio_smtp_cmd($socket, base64_encode($cfg['smtp_password']), 235);
        pramio_smtp_cmd($socket, 'MAIL FROM:<' . $from . '>', 250);
        pramio_smtp_cmd($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        pramio_smtp_cmd($socket, 'DATA', 354);

        $mailSubject = pramio_header_encode($subject);
        $fromHeader = pramio_header_encode($siteName) . ' <' . $from . '>';
        $headers = [
            'Date: ' . date('r'),
            'To: <' . $to . '>',
            'From: ' . $fromHeader,
            'Reply-To: <' . $replyTo . '>',
            'Subject: ' . $mailSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'X-Mailer: PRAMIO contact form',
        ];

        $safeBody = preg_replace('/^\./m', '..', str_replace("\n", "\r\n", str_replace("\r", '', $body)));
        fwrite($socket, implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.\r\n");
        pramio_smtp_cmd($socket, null, 250);
        pramio_smtp_cmd($socket, 'QUIT', [221, 250]);
        fclose($socket);
        return true;
    } catch (Exception $e) {
        fclose($socket);
        throw $e;
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

$subject = pramio_cut($subject, 120);
$message = pramio_cut($message, 3000);

$text = "Новая заявка с сайта {$cfg['site_name']}\n\nТема: {$subject}\nEmail: {$email}\n\nСообщение:\n{$message}";
$emailSubject = 'Заявка с сайта PRAMIO: ' . $subject;

$mailOk = false;
if (!empty($cfg['mail_to'])) {
    try {
        $mailOk = pramio_smtp_send($cfg, $cfg['mail_to'], $emailSubject, $text, $email);
    } catch (Exception $e) {
        error_log('PRAMIO SMTP failed: ' . $e->getMessage());
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $cfg['mail_from'],
            'Reply-To: ' . $email,
        ];
        $mailSubject = pramio_header_encode($emailSubject);
        $mailOk = @mail($cfg['mail_to'], $mailSubject, $text, implode("\r\n", $headers));
    }
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
