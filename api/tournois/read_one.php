
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Tournoi.php';

$database = new Database();
$db = $database->getConnection();

$tournoi = new Tournoi($db);
$tournoi->ID_tournoi = isset($_GET['id']) ? $_GET['id'] : die();
$stmt = $tournoi->readOne();
$num = $stmt->rowCount();

if($num > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $tournoi_arr = array(
        "ID_tournoi" => $row['ID_tournoi'],
        "Nom_tournoi" => $row['Nom_tournoi'],
        "Date_debut" => $row['Date_debut'],
        "Date_fin" => $row['Date_fin'],
        "Lieu" => $row['Lieu'],
        "Image_affiche" => $row['Image_affiche'],
        "ID_equipe_vainqueur" => $row['ID_equipe_vainqueur'],
        "Nom_vainqueur" => $row['Nom_vainqueur']
    );
    
    http_response_code(200);
    echo json_encode($tournoi_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Le tournoi n'existe pas."));
}
