
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/Participation.php';

$database = new Database();
$db = $database->getConnection();

$participation = new Participation($db);
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->ID_equipe) &&
    !empty($data->ID_tournoi)
) {
    $participation->ID_equipe = $data->ID_equipe;
    $participation->ID_tournoi = $data->ID_tournoi;

    if($participation->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "La participation a été créée."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de créer la participation."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible de créer la participation. Données incomplètes."));
}
