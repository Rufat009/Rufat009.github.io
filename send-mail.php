// send-mail.php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';
header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);
    try {
        $name = htmlspecialchars($_POST['name']);
        $email = htmlspecialchars($_POST['email']);
        $subject = htmlspecialchars($_POST['subject']);
        $message = htmlspecialchars($_POST['message']);
        $mail->isSMTP();
        $mail->Host       = 'mail.deviny.me'; 
        $mail->SMTPAuth   = true;
        $mail->Username   = 'contact@deviny.me';
        $mail->Password   = 'devinY2142026!';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->setFrom('contact@deviny.me', 'Deviny Contact Form');
        $mail->addAddress('contact@deviny.me');
        $mail->addReplyTo($email, $name);
        $mail->isHTML(true);
        $mail->Subject = "New Inquiry: $subject";
        $mail->Body    = "<h3>New Message from Deviny Website</h3>
                          <p><strong>Name:</strong> $name</p>
                          <p><strong>Email:</strong> $email</p>
                          <p><strong>Subject:</strong> $subject</p>
                          <p><strong>Message:</strong><br>$message</p>";
        $mail->send();
        echo json_encode(["status" => "success", "message" => "Message sent"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}