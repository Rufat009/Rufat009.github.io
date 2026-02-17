/* send-mail.php */
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';
header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);
    try {
        $userEmail = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
        if (!$userEmail) {
            echo json_encode(["status" => "error", "message" => "Please enter a valid email address (e.g. name@example.com)"]);
            exit;
        }
        $mail->isSMTP();
        $mail->Host       = 'mail.deviny.me';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'contact@deviny.me';
        $mail->Password   = 'devinY2142026!';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        $mail->setFrom('contact@deviny.me', 'Deviny Website');
        $mail->addAddress('contact@deviny.me');
        $mail->addReplyTo($userEmail, $_POST['name']);
        $mail->isHTML(true);
        $mail->Subject = "New Inquiry: " . htmlspecialchars($_POST['subject']);
        $mail->Body    = "<b>Name:</b> {$_POST['name']}<br><b>Message:</b><br>{$_POST['message']}";
        $mail->send();
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $mail->ErrorInfo]);
    }
}