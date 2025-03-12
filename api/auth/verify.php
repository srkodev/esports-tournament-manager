
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
    http_response_code(401); // Unauthorized
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

// Ici, vous devriez normalement vérifier ces identifiants par rapport à votre fichier htpasswd
// Pour simplifier, on va utiliser une valeur codée en dur, mais dans un environnement réel,
// vous voudriez lire le fichier /home/mmi24c01/htpassword.mmi

// Exemple de vérification simple (à remplacer par une vérification réelle du fichier htpasswd)
$valid_username = "admin"; // Remplacer par votre nom d'utilisateur réel
$valid_password = "admin123"; // Remplacer par votre mot de passe réel

if ($username === $valid_username && $password === $valid_password) {
    // Authentification réussie
    http_response_code(200);
    echo json_encode(["message" => "Authentification réussie"]);
} else {
    // Authentification échouée
    http_response_code(401);
    echo json_encode(["message" => "Identifiants incorrects"]);
}
