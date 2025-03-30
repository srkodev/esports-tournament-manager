<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Définir le dossier cible pour les uploads
$target_dir = "../uploads/";

// Créer le dossier s'il n'existe pas
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Vérifier si un fichier a été envoyé
if (isset($_FILES["image"])) {
    $file = $_FILES["image"];
    
    // Vérifier s'il y a des erreurs
    if ($file["error"] > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Erreur lors de l'upload: " . $file["error"]));
        exit;
    }
    
    // Vérifier le type de fichier (uniquement images)
    $allowed_types = array("image/jpeg", "image/png", "image/gif", "image/webp");
    if (!in_array($file["type"], $allowed_types)) {
        http_response_code(400);
        echo json_encode(array("message" => "Type de fichier non autorisé. Seules les images JPEG, PNG, GIF et WEBP sont acceptées."));
        exit;
    }
    
    // Nettoyer le nom de fichier pour supprimer les caractères problématiques
    $originalName = basename($file["name"]);
    $fileInfo = pathinfo($originalName);
    // On supprime tout caractère qui n'est pas une lettre, un chiffre, un tiret ou un underscore dans le nom de fichier
    $fileBaseName = preg_replace('/[^a-zA-Z0-9_\-]/', '', $fileInfo['filename']);
    $fileExtension = strtolower($fileInfo['extension']);
    
    // Générer un nom de fichier unique avec le timestamp
    $timestamp = time();
    $filename = $timestamp . "_" . $fileBaseName . "." . $fileExtension;
    $target_file = $target_dir . $filename;
    
    // Tenter de déplacer le fichier uploadé
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Succès - renvoyer le chemin relatif de l'image
        $file_path = "/api/uploads/" . $filename;
        http_response_code(200);
        echo json_encode(array(
            "message" => "Image uploadée avec succès.",
            "file_path" => $file_path
        ));
    } else {
        // Échec
        http_response_code(500);
        echo json_encode(array("message" => "Impossible d'uploader l'image."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Aucun fichier envoyé."));
}
?>
