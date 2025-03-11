
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/Equipe.php';

$database = new Database();
$db = $database->getConnection();

$equipe = new Equipe($db);
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->Nom) &&
    !empty($data->Pays) &&
    !empty($data->Date_creation)
) {
    $equipe->Nom = $data->Nom;
    $equipe->Pays = $data->Pays;
    $equipe->Jeux_principaux = $data->Jeux_principaux;
    $equipe->Date_creation = $data->Date_creation;
    $equipe->Logo = $data->Logo;
    $equipe->Site_web = $data->Site_web;

    if($equipe->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "L'équipe a été créée."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de créer l'équipe."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible de créer l'équipe. Données incomplètes."));
}
