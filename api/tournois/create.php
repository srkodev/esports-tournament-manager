
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/Tournoi.php';

$database = new Database();
$db = $database->getConnection();

$tournoi = new Tournoi($db);
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->Nom_tournoi) &&
    !empty($data->Date_debut) &&
    !empty($data->Date_fin) &&
    !empty($data->Lieu)
) {
    $tournoi->Nom_tournoi = $data->Nom_tournoi;
    $tournoi->Date_debut = $data->Date_debut;
    $tournoi->Date_fin = $data->Date_fin;
    $tournoi->Lieu = $data->Lieu;
    $tournoi->Image_affiche = $data->Image_affiche;
    $tournoi->ID_equipe_vainqueur = $data->ID_equipe_vainqueur ?? null;

    if($tournoi->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Le tournoi a été créé."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de créer le tournoi."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible de créer le tournoi. Données incomplètes."));
}
