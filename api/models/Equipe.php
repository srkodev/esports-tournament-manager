
<?php
class Equipe {
    private $conn;
    private $table_name = "equipes";

    public $ID_equipe;
    public $Nom;
    public $Pays;
    public $Jeux_principaux;
    public $Date_creation;
    public $Logo;
    public $Site_web;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE ID_equipe = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->ID_equipe);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->Nom = $row['Nom'];
            $this->Pays = $row['Pays'];
            $this->Jeux_principaux = $row['Jeux_principaux'];
            $this->Date_creation = $row['Date_creation'];
            $this->Logo = $row['Logo'];
            $this->Site_web = $row['Site_web'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    Nom = :nom,
                    Pays = :pays,
                    Jeux_principaux = :jeux,
                    Date_creation = :date,
                    Logo = :logo,
                    Site_web = :site";

        $stmt = $this->conn->prepare($query);

        // Nettoyage des données
        $this->Nom = htmlspecialchars(strip_tags($this->Nom));
        $this->Pays = htmlspecialchars(strip_tags($this->Pays));
        $this->Jeux_principaux = htmlspecialchars(strip_tags($this->Jeux_principaux));
        $this->Logo = htmlspecialchars(strip_tags($this->Logo));
        $this->Site_web = htmlspecialchars(strip_tags($this->Site_web));

        // Liaison des valeurs
        $stmt->bindParam(':nom', $this->Nom);
        $stmt->bindParam(':pays', $this->Pays);
        $stmt->bindParam(':jeux', $this->Jeux_principaux);
        $stmt->bindParam(':date', $this->Date_creation);
        $stmt->bindParam(':logo', $this->Logo);
        $stmt->bindParam(':site', $this->Site_web);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    Nom = :nom,
                    Pays = :pays,
                    Jeux_principaux = :jeux,
                    Date_creation = :date,
                    Logo = :logo,
                    Site_web = :site
                WHERE
                    ID_equipe = :id";

        $stmt = $this->conn->prepare($query);

        // Nettoyage des données
        $this->Nom = htmlspecialchars(strip_tags($this->Nom));
        $this->Pays = htmlspecialchars(strip_tags($this->Pays));
        $this->Jeux_principaux = htmlspecialchars(strip_tags($this->Jeux_principaux));
        $this->Logo = htmlspecialchars(strip_tags($this->Logo));
        $this->Site_web = htmlspecialchars(strip_tags($this->Site_web));
        $this->ID_equipe = htmlspecialchars(strip_tags($this->ID_equipe));

        // Liaison des valeurs
        $stmt->bindParam(':nom', $this->Nom);
        $stmt->bindParam(':pays', $this->Pays);
        $stmt->bindParam(':jeux', $this->Jeux_principaux);
        $stmt->bindParam(':date', $this->Date_creation);
        $stmt->bindParam(':logo', $this->Logo);
        $stmt->bindParam(':site', $this->Site_web);
        $stmt->bindParam(':id', $this->ID_equipe);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE ID_equipe = ?";
        $stmt = $this->conn->prepare($query);
        $this->ID_equipe = htmlspecialchars(strip_tags($this->ID_equipe));
        $stmt->bindParam(1, $this->ID_equipe);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
