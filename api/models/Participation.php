
<?php
class Participation {
    private $conn;
    private $table_name = "participations";

    public $ID_participation;
    public $ID_equipe;
    public $ID_tournoi;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT p.*, e.Nom as Nom_equipe, t.Nom_tournoi 
                FROM " . $this->table_name . " p
                JOIN equipes e ON p.ID_equipe = e.ID_equipe
                JOIN tournois t ON p.ID_tournoi = t.ID_tournoi";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    ID_equipe = :equipe,
                    ID_tournoi = :tournoi";

        $stmt = $this->conn->prepare($query);

        // Liaison
        $stmt->bindParam(':equipe', $this->ID_equipe);
        $stmt->bindParam(':tournoi', $this->ID_tournoi);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE ID_participation = ?";
        $stmt = $this->conn->prepare($query);
        $this->ID_participation = htmlspecialchars(strip_tags($this->ID_participation));
        $stmt->bindParam(1, $this->ID_participation);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByTournoi($tournoi_id) {
        $query = "SELECT p.*, e.Nom as Nom_equipe 
                FROM " . $this->table_name . " p
                JOIN equipes e ON p.ID_equipe = e.ID_equipe
                WHERE p.ID_tournoi = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $tournoi_id);
        $stmt->execute();
        return $stmt;
    }
}
