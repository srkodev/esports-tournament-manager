
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/Equipe.php';

$database = new Database();
$db = $database->getConnection();

$equipe = new Equipe($db);
$data = json_decode(file_get_contents("php://input"));

// Vérification des données requises
if(
    !empty($data->ID_equipe) &&
    !empty($data->Nom) &&
    !empty($data->Pays) &&
    !empty($data->Date_creation)
) {
    // Assignation des valeurs
    $equipe->ID_equipe = $data->ID_equipe;
    $equipe->Nom = $data->Nom;
    $equipe->Pays = $data->Pays;
    $equipe->Jeux_principaux = $data->Jeux_principaux;
    $equipe->Date_creation = $data->Date_creation;
    $equipe->Logo = $data->Logo;
    $equipe->Site_web = $data->Site_web;

    if($equipe->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "L'équipe a été mise à jour."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de mettre à jour l'équipe."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible de mettre à jour l'équipe. Données incomplètes."));
}
