<?php
session_name('pramio_form');
session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => (!empty($_SERVER['HTTP_X_HTTPS']) && $_SERVER['HTTP_X_HTTPS'] === '1') || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'use_strict_mode' => true,
]);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function pramio_new_form_token() {
    $token = bin2hex(random_bytes(24));
    $_SESSION['pramio_form_token'] = $token;
    $_SESSION['pramio_form_token_issued_at'] = time();
    return $token;
}

function pramio_rate_limit($clientKey, $limit = 5, $windowSeconds = 3600) {
    $file = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'pramio-form-' . hash('sha256', $clientKey) . '.json';
    $handle = @fopen($file, 'c+');
    if (!$handle) return true;

    $allowed = true;
    if (flock($handle, LOCK_EX)) {
        $raw = stream_get_contents($handle);
        $stored = json_decode($raw ?: '[]', true);
        $now = time();
        $attempts = is_array($stored) ? array_values(array_filter($stored, function ($timestamp) use ($now, $windowSeconds) {
            return is_int($timestamp) && $timestamp > ($now - $windowSeconds);
        })) : [];

        if (count($attempts) >= $limit) {
            $allowed = false;
        } else {
            $attempts[] = $now;
            rewind($handle);
            ftruncate($handle, 0);
            fwrite($handle, json_encode($attempts));
            fflush($handle);
        }
        flock($handle, LOCK_UN);
    }
    fclose($handle);
    return $allowed;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['form_token'])) {
    echo json_encode(['ok' => true, 'token' => pramio_new_form_token()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$cfg = [
    'site_name' => 'PRAMIO',
    'mail_to' => 'hello@pramio.ru',
    'mail_from' => 'no-reply@pramio.ru',
    // Timeweb SMTP: encrypted connection on port 465.
    'smtp_host' => 'ssl://smtp.timeweb.ru',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl',
    'smtp_user' => 'no-reply@pramio.ru',
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

function pramio_normalize_smtp($cfg) {
    $host = trim((string)($cfg['smtp_host'] ?? ''));
    $port = (int)($cfg['smtp_port'] ?? 465);
    $secure = strtolower(trim((string)($cfg['smtp_secure'] ?? 'ssl')));

    $host = preg_replace('/\s+/', '', $host);
    $scheme = '';

    if (stripos($host, 'ssl://') === 0) {
        $scheme = 'ssl';
        $host = substr($host, 6);
    } elseif (stripos($host, 'tls://') === 0) {
        $scheme = 'tls';
        $host = substr($host, 6);
    } elseif (stripos($host, 'tcp://') === 0) {
        $scheme = 'tcp';
        $host = substr($host, 6);
    }

    if (strpos($host, ':') !== false && substr_count($host, ':') === 1) {
        list($hostOnly, $portPart) = explode(':', $host, 2);
        if ($hostOnly !== '' && ctype_digit($portPart)) {
            $host = $hostOnly;
            $port = (int)$portPart;
        }
    }

    if ($scheme === 'ssl') {
        $secure = 'ssl';
    } elseif ($scheme === 'tls') {
        $secure = 'tls';
    }

    if ($secure === 'ssl') {
        $remote = 'ssl://' . $host . ':' . $port;
    } else {
        $remote = 'tcp://' . $host . ':' . $port;
    }

    return [$remote, $host, $port, $secure];
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

    list($remote, $host, $port, $secure) = pramio_normalize_smtp($cfg);

    $from = !empty($cfg['mail_from']) ? trim((string)$cfg['mail_from']) : trim((string)$cfg['smtp_user']);
    $smtpUser = trim((string)$cfg['smtp_user']);
    $siteName = !empty($cfg['site_name']) ? $cfg['site_name'] : 'PRAMIO';

    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid sender or recipient');
    }

    if (strcasecmp($from, $smtpUser) !== 0) {
        throw new Exception('mail_from and smtp_user must match for SMTP delivery');
    }

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
            'SNI_enabled' => true,
            'SNI_server_name' => $host,
        ],
    ]);

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new Exception('Connection failed to ' . $remote . ' (errno ' . $errno . '): ' . $errstr);
    }
    stream_set_timeout($socket, 20);

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
        pramio_smtp_cmd($socket, base64_encode($smtpUser), 334);
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

$service = trim((string)($_POST['service'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$consent = (string)($_POST['consent'] ?? '');
$website = trim((string)($_POST['website'] ?? ''));
$startedAt = (int)($_POST['started_at'] ?? 0);
$formToken = trim((string)($_POST['form_token'] ?? ''));

// A filled hidden field is treated as an automated submission. Return a neutral
// success response so the form does not reveal the anti-spam rule.
if ($website !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$host = strtolower(preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
$origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
$referer = trim((string)($_SERVER['HTTP_REFERER'] ?? ''));
$sourceOk = true;
if ($origin !== '') {
    $sourceOk = strtolower((string)parse_url($origin, PHP_URL_HOST)) === $host;
} elseif ($referer !== '') {
    $sourceOk = strtolower((string)parse_url($referer, PHP_URL_HOST)) === $host;
}

$sessionToken = (string)($_SESSION['pramio_form_token'] ?? '');
$tokenIssuedAt = (int)($_SESSION['pramio_form_token_issued_at'] ?? 0);
$tokenOk = $formToken !== '' && $sessionToken !== '' && hash_equals($sessionToken, $formToken) && $tokenIssuedAt > (time() - 3600);
if (!$sourceOk || !$tokenOk) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'request_rejected']);
    exit;
}

$nowMs = (int)round(microtime(true) * 1000);
if ($startedAt > 0 && ($nowMs - $startedAt) < 1500) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'too_fast']);
    exit;
}

if ($startedAt <= 0 || ($nowMs - $startedAt) > 7200000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'form_expired']);
    exit;
}

$lastSubmitAt = (int)($_SESSION['pramio_last_submit_at'] ?? 0);
if ($lastSubmitAt > 0 && (time() - $lastSubmitAt) < 45) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate_limited']);
    exit;
}

$clientAddress = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!pramio_rate_limit($clientAddress)) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate_limited']);
    exit;
}

$allowedServices = [
    'Лендинг или небольшой сайт',
    'Telegram-бот',
    'Бот или решение для MAX',
    'AI-ассистент или автоматизация',
    'Интерактивный сервис или поддержка',
    'АдминКИТ',
    'Другая задача',
];

if (!in_array($service, $allowedServices, true) || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $consent !== '1') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'validation_failed']);
    exit;
}

$service = pramio_cut($service, 120);
$message = pramio_cut($message, 3000);

$text = "Новая заявка с сайта {$cfg['site_name']}\n\nНаправление: {$service}\nEmail: {$email}\nСогласие на обработку данных: получено\n\nСообщение:\n{$message}";
$emailSubject = 'Заявка с сайта PRAMIO: ' . $service;

$mailOk = false;
if (!empty($cfg['mail_to'])) {
    try {
        $mailOk = pramio_smtp_send($cfg, $cfg['mail_to'], $emailSubject, $text, $email);
    } catch (Exception $e) {
        error_log('PRAMIO SMTP failed: ' . $e->getMessage());
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

$_SESSION['pramio_last_submit_at'] = time();
echo json_encode(['ok' => true, 'token' => pramio_new_form_token()]);
