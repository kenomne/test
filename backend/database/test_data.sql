-- Test podaci za development
-- Ovi podaci će biti ubačeni nakon kreiranja tabela

-- Brisanje postojećih podataka (PAŽNJA: ovo briše sve!)
-- DELETE FROM match_history;
-- DELETE FROM user_sessions;
-- DELETE FROM users;

-- Test korisnici (šifre su hash od 'password123')
INSERT INTO users (username, email, password_hash, avatar, rating, games_played, games_won, games_lost) VALUES
('testuser1', 'user1@crowbar.gg', '$2b$10$rOZhPz.G9qB7cONfNR8LXOhVXs4jP5k8lAQp2KwY9V2X7sR1Z2mXy', 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=U1', 1200, 25, 15, 10),
('gamer_pro', 'pro@crowbar.gg', '$2b$10$rOZhPz.G9qB7cONfNR8LXOhVXs4jP5k8lAQp2KwY9V2X7sR1Z2mXy', 'https://via.placeholder.com/150/667EEA/FFFFFF?text=GP', 1500, 45, 30, 15),
('noob_player', 'noob@crowbar.gg', '$2b$10$rOZhPz.G9qB7cONfNR8LXOhVXs4jP5k8lAQp2KwY9V2X7sR1Z2mXy', 'https://via.placeholder.com/150/764BA2/FFFFFF?text=NP', 900, 10, 3, 7),
('elite_gamer', 'elite@crowbar.gg', '$2b$10$rOZhPz.G9qB7cONfNR8LXOhVXs4jP5k8lAQp2KwY9V2X7sR1Z2mXy', 'https://via.placeholder.com/150/E55A2E/FFFFFF?text=EG', 1800, 60, 45, 15),
('casual_player', 'casual@crowbar.gg', '$2b$10$rOZhPz.G9qB7cONfNR8LXOhVXs4jP5k8lAQp2KwY9V2X7sR1Z2mXy', 'https://via.placeholder.com/150/5A6268/FFFFFF?text=CP', 1100, 20, 11, 9);

-- Test match history
INSERT INTO match_history (player1_id, player2_id, winner_id, loser_id, player1_rating_before, player2_rating_before, player1_rating_after, player2_rating_after, rating_change, game_type, game_duration, notes) VALUES
(1, 2, 2, 1, 1180, 1480, 1160, 1500, 20, 'ranked', 1800, 'Intenzivan meč sa velikim obratom'),
(3, 4, 4, 3, 920, 1780, 900, 1800, 20, 'ranked', 900, 'Brza pobeda elite igrača'),
(1, 5, 1, 5, 1160, 1120, 1180, 1100, 20, 'casual', 1200, 'Casual partija'),
(2, 3, 2, 3, 1500, 900, 1510, 890, 10, 'ranked', 1500, 'Očekivana pobeda'),
(4, 5, 5, 4, 1800, 1100, 1785, 1115, 15, 'casual', 2100, 'Iznenađujući rezultat!'),
(1, 4, 4, 1, 1180, 1785, 1165, 1800, 15, 'ranked', 1650, 'Elite vs testuser1'),
(2, 5, 2, 5, 1510, 1115, 1520, 1105, 10, 'casual', 980, 'Kratak meč'),
(3, 1, 1, 3, 890, 1165, 880, 1175, 10, 'ranked', 1320, 'Testuser1 pobedio noob_player');