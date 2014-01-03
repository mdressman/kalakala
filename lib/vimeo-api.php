<?php
/*
Template Name: Vimeo API
*/
require_once('vimeo.php');
session_start();

// Create the object and enable caching
$vimeo = new phpVimeo('f20712957b71ef7d091b299a8d3320e5ca5521cf', '4f31e7c89591fd4f57a4e096c996c438f46dd14f');
$vimeo->enableCache(phpVimeo::CACHE_FILE, './cache', 300);

// Clear session
if ($_GET['clear'] == 'all') {
    session_destroy();
    session_start();
}

// Set up variables
$state = $_SESSION['vimeo_state'];
$request_token = $_SESSION['oauth_request_token'];
$access_token = $_SESSION['oauth_access_token'];

// Coming back
if ($_REQUEST['oauth_token'] != NULL && $_SESSION['vimeo_state'] === 'start') {
    $_SESSION['vimeo_state'] = $state = 'returned';
}

// If we have an access token, set it
if ($_SESSION['oauth_access_token'] != null) {
    $vimeo->setToken($_SESSION['oauth_access_token'], $_SESSION['oauth_access_token_secret']);
}

switch ($_SESSION['vimeo_state']) {
    default:

        // Get a new request token
        $token = $vimeo->getRequestToken();

        // Store it in the session
        $_SESSION['oauth_request_token'] = $token['oauth_token'];
        $_SESSION['oauth_request_token_secret'] = $token['oauth_token_secret'];
        $_SESSION['vimeo_state'] = 'start';

        // Build authorize link
        $authorize_link = $vimeo->getAuthorizeUrl($token['oauth_token'], 'write');

        break;

    case 'returned':

        // Store it
        if ($_SESSION['oauth_access_token'] === NULL && $_SESSION['oauth_access_token_secret'] === NULL) {
            // Exchange for an access token
            $vimeo->setToken($_SESSION['oauth_request_token'], $_SESSION['oauth_request_token_secret']);
            $token = $vimeo->getAccessToken($_REQUEST['oauth_verifier']);

            // Store
            $_SESSION['oauth_access_token'] = $token['oauth_token'];
            $_SESSION['oauth_access_token_secret'] = $token['oauth_token_secret'];
            $_SESSION['vimeo_state'] = 'done';

            // Set the token
            $vimeo->setToken($_SESSION['oauth_access_token'], $_SESSION['oauth_access_token_secret']);
        }

        // Do an authenticated call
        try {
            $videos = $vimeo->call('vimeo.videos.getUploaded');
        }
        catch (VimeoAPIException $e) {
            echo "Encountered an API error -- code {$e->getCode()} - {$e->getMessage()}";
        }

        break;
}

?>
