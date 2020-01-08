<?php

// Read JSON files
$jsonConfig = file_get_contents(__DIR__ . '/../../config.json');
$config = json_decode($jsonConfig);

$jsonShare = file_get_contents(__DIR__ . '/../../tmp/share.json');
$share = json_decode($jsonShare);

// If browser are not allowed, block connexion from unauthorized source
if(!$config->browser) {
    $token = null;
    $cookie = true;
    // Search token in get parameter
    if(isset($_GET['__photon_token'])) {
        $token = $_GET['__photon_token'];
        $cookie = false;
    }
    // Search token in cookie
    else if(isset($_COOKIE['__photon_token'])) {
        $token = $_COOKIE['__photon_token'];
    }

    // If no token find
    if($token !== $share->token) {
        header('HTTP/1.0 403 Forbidden');
        echo $token;
        exit('<h1>403 Forbidden</h1>');
    }
    
    // Add cookie if is not set
    if(!$cookie) {
        setcookie('__photon_token', $share->token);
    }
}

// Load Photon class and function
require 'logger.php';
require 'error.php';
require 'constant.php';
require 'function.php';
require 'photon.php';

// Load error manager
$logger = new Logger('Photon', $_PHOTON['root'] . 'log/photon-' . date('Y-m-d'));
PhotonError::set_logger($logger);
$error = PhotonError::get_instance();

// Create global variables
global $_PHOTON;
$_PHOTON = json_decode($jsonShare, true);
global $photon;
$photon = new Photon($_PHOTON);

return false;