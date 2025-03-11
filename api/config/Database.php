<?php
class Database {
    private $host = "localhost";
    private $db_name = "tournoi_db";
    private $username = "tournoi_user";
    private $password = "password_secure";
    private $conn;

    public function __construct() {
        // Configuration uniquement pour le développement
        // (aucune gestion d’environnement ici)
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $exception) {
            http_response_code(500);
            echo json_encode(["message" => "Erreur de connexion à la base de données: " . $exception->getMessage()]);
            die();
        }

        return $this->conn;
    }
}
