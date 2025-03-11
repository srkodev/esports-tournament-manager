
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Tournoi.php';

$database = new Database();
$db = $database->getConnection();

$tournoi = new Tournoi($db);
$stmt = $tournoi->read();
$num = $stmt->rowCount();

if($num > 0) {
    $tournois_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $tournoi_item = array(
            "ID_tournoi" => $ID_tournoi,
            "Nom_tournoi" => $Nom_tournoi,
            "Date_debut" => $Date_debut,
            "Date_fin" => $Date_fin,
            "Lieu" => $Lieu,
            "Image_affiche" => $Image_affiche,
            "ID_equipe_vainqueur" => $ID_equipe_vainqueur,
            "Nom_vainqueur" => $Nom_vainqueur
        );
        array_push($tournois_arr, $tournoi_item);
    }
    http_response_code(200);
    echo json_encode($tournois_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Aucun tournoi trouvé."));
}
