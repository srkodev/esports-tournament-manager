
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/Equipe.php';

$database = new Database();
$db = $database->getConnection();

$equipe = new Equipe($db);
$data = json_decode(file_get_contents("php://input"));

// Vérification de l'ID
if(!empty($data->ID_equipe)) {
    $equipe->ID_equipe = $data->ID_equipe;

    if($equipe->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "L'équipe a été supprimée."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de supprimer l'équipe."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible de supprimer l'équipe. ID non fourni."));
}
