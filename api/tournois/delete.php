
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/Tournoi.php';

$database = new Database();
$db = $database->getConnection();

$tournoi = new Tournoi($db);
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->ID_tournoi)) {
    $tournoi->ID_tournoi = $data->ID_tournoi;

    if($tournoi->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Le tournoi a été supprimé."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de supprimer le tournoi."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible de supprimer le tournoi. ID non fourni."));
}
