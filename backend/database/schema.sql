-- Kreiranje baze podataka za crowbar.gg
-- MySQL/MariaDB kompatibilno

-- Kreiranje baze (opciono)
-- CREATE DATABASE IF NOT EXISTS crowbarDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE crowbarDB;

-- Tabela za korisnike
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    rating INT DEFAULT 1000,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    games_lost INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indeksi za bolje performanse
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- Tabela za match history
CREATE TABLE IF NOT EXISTS match_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player1_id INT NOT NULL,
    player2_id INT NOT NULL,
    winner_id INT NOT NULL,
    loser_id INT NOT NULL,
    player1_rating_before INT NOT NULL,
    player2_rating_before INT NOT NULL,
    player1_rating_after INT NOT NULL,
    player2_rating_after INT NOT NULL,
    rating_change INT NOT NULL,
    game_type VARCHAR(50) DEFAULT 'casual',
    game_duration INT DEFAULT NULL, -- u sekundama
    match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT DEFAULT NULL,
    
    -- Foreign keys
    FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (loser_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indeksi
    INDEX idx_player1 (player1_id),
    INDEX idx_player2 (player2_id),
    INDEX idx_winner (winner_id),
    INDEX idx_match_date (match_date),
    INDEX idx_game_type (game_type)
);

-- Tabela za user sessions (opciono za autentifikaciju)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
);