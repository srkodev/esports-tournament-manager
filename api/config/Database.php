
<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Déterminer l'environnement
        $env = getenv('APP_ENV') ?: 'production';

        if ($env === 'development') {
            // Configuration de développement
            $this->host = "localhost";
            $this->db_name = "tournoi_db";
            $this->username = "tournoi_user";
            $this->password = "password_secure";
        } else {
            // Configuration de production
            // Vous pouvez définir ces variables d'environnement dans votre serveur
            // ou les définir directement ici
            $this->host = getenv('DB_HOST') ?: "localhost";
            $this->db_name = getenv('DB_NAME') ?: "tournoi_db";
            $this->username = getenv('DB_USER') ?: "tournoi_user";
            $this->password = getenv('DB_PASSWORD') ?: "votre_mot_de_passe_de_production";
        }
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
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode(array("message" => "Erreur de connexion à la base de données: " . $exception->getMessage()));
            die();
        }

        return $this->conn;
    }
}
