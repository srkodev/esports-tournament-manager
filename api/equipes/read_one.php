
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Equipe.php';

$database = new Database();
$db = $database->getConnection();

$equipe = new Equipe($db);

// Récupération de l'ID depuis l'URL
$equipe->ID_equipe = isset($_GET['id']) ? $_GET['id'] : die();

// Lecture des détails de l'équipe
if($equipe->readOne()) {
    // Création du tableau
    $equipe_arr = array(
        "ID_equipe" => $equipe->ID_equipe,
        "Nom" => $equipe->Nom,
        "Pays" => $equipe->Pays,
        "Jeux_principaux" => $equipe->Jeux_principaux,
        "Date_creation" => $equipe->Date_creation,
        "Logo" => $equipe->Logo,
        "Site_web" => $equipe->Site_web
    );

    http_response_code(200);
    echo json_encode($equipe_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "L'équipe n'existe pas."));
}
