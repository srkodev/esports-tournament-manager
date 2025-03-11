
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Equipe.php';

$database = new Database();
$db = $database->getConnection();

$equipe = new Equipe($db);
$stmt = $equipe->read();
$num = $stmt->rowCount();

if($num > 0) {
    $equipes_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $equipe_item = array(
            "ID_equipe" => $ID_equipe,
            "Nom" => $Nom,
            "Pays" => $Pays,
            "Jeux_principaux" => $Jeux_principaux,
            "Date_creation" => $Date_creation,
            "Logo" => $Logo,
            "Site_web" => $Site_web
        );
        array_push($equipes_arr, $equipe_item);
    }
    http_response_code(200);
    echo json_encode($equipes_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Aucune équipe trouvée."));
}
