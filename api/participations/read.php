
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Participation.php';

$database = new Database();
$db = $database->getConnection();

$participation = new Participation($db);
$stmt = $participation->read();
$num = $stmt->rowCount();

if($num > 0) {
    $participations_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $participation_item = array(
            "ID_participation" => $ID_participation,
            "ID_equipe" => $ID_equipe,
            "ID_tournoi" => $ID_tournoi,
            "Nom_equipe" => $Nom_equipe,
            "Nom_tournoi" => $Nom_tournoi
        );
        array_push($participations_arr, $participation_item);
    }
    http_response_code(200);
    echo json_encode($participations_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Aucune participation trouvée."));
}
