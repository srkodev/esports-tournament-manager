-- Création de la base de données
CREATE DATABASE IF NOT EXISTS tournoi_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tournoi_db;

-- Création de l'utilisateur et assignation des privilèges
CREATE USER IF NOT EXISTS 'tournoi_user'@'localhost' IDENTIFIED BY 'password_secure';
GRANT ALL PRIVILEGES ON tournoi_db.* TO 'tournoi_user'@'localhost';
FLUSH PRIVILEGES;

-- Table des équipes
CREATE TABLE equipes (
    ID_equipe INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL UNIQUE,
    Pays VARCHAR(50) NOT NULL,
    Jeux_principaux VARCHAR(255),
    Date_creation DATE NOT NULL,
    Logo VARCHAR(255),
    Site_web VARCHAR(255)
);

-- Table des tournois
CREATE TABLE tournois (
    ID_tournoi INT AUTO_INCREMENT PRIMARY KEY,
    Nom_tournoi VARCHAR(100) NOT NULL UNIQUE,
    Date_debut DATE NOT NULL,
    Date_fin DATE NOT NULL CHECK (Date_fin > Date_debut),
    Lieu VARCHAR(100) NOT NULL,
    Image_affiche VARCHAR(255),
    ID_equipe_vainqueur INT DEFAULT NULL,
    FOREIGN KEY (ID_equipe_vainqueur) REFERENCES equipes(ID_equipe) ON DELETE SET NULL
);

-- Table des participations des équipes aux tournois
CREATE TABLE participations (
    ID_participation INT AUTO_INCREMENT PRIMARY KEY,
    ID_equipe INT NOT NULL,
    ID_tournoi INT NOT NULL,
    FOREIGN KEY (ID_equipe) REFERENCES equipes(ID_equipe) ON DELETE CASCADE,
    FOREIGN KEY (ID_tournoi) REFERENCES tournois(ID_tournoi) ON DELETE CASCADE,
    UNIQUE (ID_equipe, ID_tournoi) -- Pour éviter qu'une équipe soit inscrite plusieurs fois au même tournoi
);