# MySQL Database Setup za Crowbar.gg

## 🗄️ Preduslovi

Potrebno je da imate instaliran MySQL ili MariaDB server na vašem sistemu.

### Windows instalacija:
1. Preuzmite MySQL Community Server sa: https://dev.mysql.com/downloads/mysql/
2. Ili instalirajte XAMPP: https://www.apachefriends.org/index.html

### Brza instalacija sa Chocolatey:
```powershell
choco install mysql
```

## 🔧 Kreiranje baze podataka

### 1. Pristupite MySQL shell-u:
```bash
mysql -u root -p
```

### 2. Kreirajte bazu podataka:
```sql
CREATE DATABASE crowbarDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crowbarDB;
```

### 3. Kreirajte korisnika (opciono):
```sql
CREATE USER 'crowbar_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON crowbarDB.* TO 'crowbar_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📋 Kreiranje tabela

Aplikacija će automatski kreirati tabele pri prvom pokretanju koristeći `database/schema.sql` fajl.

Alternativno, možete ručno pokrenuti:

```bash
mysql -u root -p crowbarDB < database/schema.sql
```

## 🎯 Test podaci

Za testiranje i razvoj, možete učitati test podatke:

```bash
mysql -u root -p crowbarDB < database/test_data.sql
```

Ovi podaci uključuju:
- 5 test korisnika sa različitim rating-ima
- 8 primer meceva sa pravilno izračunatim rating promenama
- Demonstracija ELO rating sistema

## ⚙️ Konfiguracija

Ažurirajte `.env` fajl sa vašim database podacima:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crowbarDB
DB_USER=root                # ili crowbar_user
DB_PASSWORD=your_password
```

## 🔍 Verifikacija

Pokrenite backend server:
```bash
npm run dev
```

Trebalo bi da vidite:
```
✅ MySQL uspešno povezan!
✅ Test query prošao: { test: 1 }
🔄 Inicijalizujem bazu podataka...
✅ Baza podataka inicijalizovana!
🚀 Crowbar.gg Server je pokrenut!
```

## 📊 Test API pozivi

Registracija novog korisnika:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "password123",
    "avatar": "https://via.placeholder.com/150"
  }'
```

Prijava:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "password123"
  }'
```

Leaderboard:
```bash
curl http://localhost:5000/api/users/leaderboard
```

## 🗃️ Database schema

### users tabela:
- `id` - Primary key
- `username` - Jedinstveno korisničko ime
- `email` - Jedinstvena email adresa
- `password_hash` - BCrypt hash lozinke
- `avatar` - URL slike avatara
- `rating` - ELO rating (default: 1000)
- `games_played`, `games_won`, `games_lost` - Statistike
- `created_at`, `updated_at`, `last_login` - Timestamps
- `is_active` - Soft delete flag

### match_history tabela:
- `id` - Primary key
- `player1_id`, `player2_id` - Foreign keys za igrače
- `winner_id`, `loser_id` - Foreign keys
- `*_rating_before`, `*_rating_after` - Rating pre i posle meča
- `rating_change` - Koliko se rating promenio
- `game_type` - 'casual', 'ranked', 'tournament'
- `game_duration` - Trajanje u sekundama
- `match_date` - Timestamp meča
- `notes` - Opcione napomene

## 🚨 Česti problemi

### "Access denied for user"
- Proverite username/password u .env fajlu
- Proverite da li je MySQL server pokrenut

### "Database does not exist"
- Kreirajte bazu ručno: `CREATE DATABASE crowbarDB;`

### Connection timeout
- Proverite da li je MySQL pokrenut na portu 3306
- Proverite firewall podešavanja

### "Table doesn't exist"
- Aplikacija automatski kreira tabele
- Ili pokrenite ručno: `mysql -u root -p crowbarDB < database/schema.sql`