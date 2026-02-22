<?php
// send-to-telegram.php
header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $contact_details = $_POST['contact_details'] ?? '';
    $reply_method = $_POST['reply_method'] ?? '';
    $message = $_POST['message'] ?? '';

    $botToken = '8214752372:AAGim3uWTrFgFlBtuS-UEFUpm4h8QGXOOWg';
    $chatId = '-5197789774';

    $text = "Новая заявка (Deviny):\n\n" .
        "Имя: $name\n" .
        "Контакты: $contact_details\n" .
        "Способ связи: $reply_method\n" .
        "Суть задачи: $message";

    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $text
    ];

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded",
            'content' => http_build_query($data)
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Telegram API error"]);
    }
}