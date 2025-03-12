
<?php
// Activation des en-têtes CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, Access-Control-Allow-Headers, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Gestion des requêtes OPTIONS (pre-flight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier si l'en-tête d'autorisation est présent
if (!isset($_SERVER['HTTP_AUTHORIZATION']) || empty($_SERVER['HTTP_AUTHORIZATION'])) {
    http_response_code(401);
    echo json_encode(["message" => "Authentification requise"]);
    exit();
}

// Extraire les identifiants de l'en-tête
$auth_header = $_SERVER['HTTP_AUTHORIZATION'];
if (strpos($auth_header, 'Basic') !== 0) {
    http_response_code(401);
    echo json_encode(["message" => "Format d'authentification non supporté"]);
    exit();
}

// Décoder les identifiants
$credentials = base64_decode(substr($auth_header, 6));
list($username, $password) = explode(':', $credentials, 2);

// Chemin vers le fichier htpassword
$htpasswd_file = '/home/mmi24c01/htpassword.mmi';

// Vérifier si le fichier existe
if (!file_exists($htpasswd_file)) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de configuration du serveur"]);
    exit();
}

// Lire le fichier htpassword
$htpasswd_content = file_get_contents($htpasswd_file);
$lines = explode("\n", $htpasswd_content);

$authenticated = false;

foreach ($lines as $line) {
    if (empty(trim($line))) continue;
    
    // Format du fichier htpasswd : username:hashedpassword
    list($stored_username, $stored_hash) = explode(':', trim($line));
    
    if ($username === $stored_username) {
        // Le mot de passe dans htpasswd utilise crypt() ou MD5 ou bcrypt
        // Vérifions d'abord si c'est un hash bcrypt (commence par $2y$)
        if (strpos($stored_hash, '$2y$') === 0) {
            if (password_verify($password, $stored_hash)) {
                $authenticated = true;
                break;
            }
        }
        // Sinon, vérifions avec crypt() pour la compatibilité avec les anciens hashes
        else {
            $salt = substr($stored_hash, 0, 2);
            if (crypt($password, $salt) === $stored_hash) {
                $authenticated = true;
                break;
            }
        }
    }
}

if ($authenticated) {
    http_response_code(200);
    echo json_encode(["message" => "Authentification réussie"]);
} else {
    http_response_code(401);
    echo json_encode(["message" => "Identifiants incorrects"]);
}
