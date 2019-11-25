<?php

// Read JSON files
$json = file_get_contents(__DIR__ . '/../../config.json');
$config = json_decode($json);

$json = file_get_contents(__DIR__ . '/../../tmp/share.json');
$share = json_decode($json);

// If browser are not allowed, block connexion from unauthorized source
if(!$config->browser) {
    // Search token in cookie
    $token = null;
    $cookie = true;
    if(isset($_COOKIE['__photon_token'])) {
        $token = $_COOKIE['__photon_token'];
    }
    // Search cookien in get parameter
    else if(isset($_GET['__photon_token'])) {
        $token = $_GET['__photon_token'];
        $cookie = false;
    }

    // If no token find
    if($token !== $share->token) {
        header('HTTP/1.0 403 Forbidden');
        exit('<h1>403 Forbidden</h1>');
    }
    
    // Add cookie if is not set
    if(!$cookie) {
        setcookie('__photon_token', $share->token);
    }
}

return false;