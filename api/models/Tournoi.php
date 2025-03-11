
<?php
class Tournoi {
    private $conn;
    private $table_name = "tournois";

    public $ID_tournoi;
    public $Nom_tournoi;
    public $Date_debut;
    public $Date_fin;
    public $Lieu;
    public $Image_affiche;
    public $ID_equipe_vainqueur;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT t.*, e.Nom as Nom_vainqueur 
                FROM " . $this->table_name . " t 
                LEFT JOIN equipes e ON t.ID_equipe_vainqueur = e.ID_equipe";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT t.*, e.Nom as Nom_vainqueur 
                FROM " . $this->table_name . " t 
                LEFT JOIN equipes e ON t.ID_equipe_vainqueur = e.ID_equipe 
                WHERE t.ID_tournoi = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->ID_tournoi);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    Nom_tournoi = :nom,
                    Date_debut = :debut,
                    Date_fin = :fin,
                    Lieu = :lieu,
                    Image_affiche = :image,
                    ID_equipe_vainqueur = :vainqueur";

        $stmt = $this->conn->prepare($query);

        // Nettoyage
        $this->Nom_tournoi = htmlspecialchars(strip_tags($this->Nom_tournoi));
        $this->Lieu = htmlspecialchars(strip_tags($this->Lieu));
        $this->Image_affiche = htmlspecialchars(strip_tags($this->Image_affiche));

        // Liaison
        $stmt->bindParam(':nom', $this->Nom_tournoi);
        $stmt->bindParam(':debut', $this->Date_debut);
        $stmt->bindParam(':fin', $this->Date_fin);
        $stmt->bindParam(':lieu', $this->Lieu);
        $stmt->bindParam(':image', $this->Image_affiche);
        $stmt->bindParam(':vainqueur', $this->ID_equipe_vainqueur);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    Nom_tournoi = :nom,
                    Date_debut = :debut,
                    Date_fin = :fin,
                    Lieu = :lieu,
                    Image_affiche = :image,
                    ID_equipe_vainqueur = :vainqueur
                WHERE
                    ID_tournoi = :id";

        $stmt = $this->conn->prepare($query);

        // Nettoyage
        $this->Nom_tournoi = htmlspecialchars(strip_tags($this->Nom_tournoi));
        $this->Lieu = htmlspecialchars(strip_tags($this->Lieu));
        $this->Image_affiche = htmlspecialchars(strip_tags($this->Image_affiche));

        // Liaison
        $stmt->bindParam(':nom', $this->Nom_tournoi);
        $stmt->bindParam(':debut', $this->Date_debut);
        $stmt->bindParam(':fin', $this->Date_fin);
        $stmt->bindParam(':lieu', $this->Lieu);
        $stmt->bindParam(':image', $this->Image_affiche);
        $stmt->bindParam(':vainqueur', $this->ID_equipe_vainqueur);
        $stmt->bindParam(':id', $this->ID_tournoi);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE ID_tournoi = ?";
        $stmt = $this->conn->prepare($query);
        $this->ID_tournoi = htmlspecialchars(strip_tags($this->ID_tournoi));
        $stmt->bindParam(1, $this->ID_tournoi);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
