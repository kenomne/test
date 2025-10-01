# 🔗 Crowbar.gg API Dokumentacija

Kompletna dokumentacija za sve dostupne API endpoint-e.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Većina endpoint-a zahteva JWT token u Authorization header-u:
```
Authorization: Bearer <your_jwt_token>
```

Token se dobija nakon uspešnog login-a ili registracije.

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
Registracija novog korisnika.

**Request Body:**
```json
{
  "username": "string (3-30 chars, alphanumeric)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "avatar": "string (optional, valid URL)"
}
```

**Response (201):**
```json
{
  "message": "Korisnik uspešno kreiran",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "avatar": "https://...",
    "rating": 1000,
    "games_played": 0,
    "games_won": 0,
    "games_lost": 0,
    "created_at": "2025-09-19T...",
    "is_active": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login
Prijava korisnika.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Uspešna prijava",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/auth/me
Dobijanje podataka trenutno ulogovanog korisnika.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": { /* current user object */ }
}
```

### PUT /api/auth/profile
Ažuriranje profila trenutnog korisnika.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "avatar": "string (optional)"
}
```

---

## 👥 Users Endpoints

### GET /api/users
Lista svih korisnika sa paginacijom.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 50)

**Response (200):**
```json
{
  "message": "Lista korisnika",
  "data": [
    { /* user objects */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10
  }
}
```

### GET /api/users/leaderboard
Top igrači po rating-u.

**Query Parameters:**
- `limit` (number, default: 10, max: 50)

**Response (200):**
```json
{
  "message": "Leaderboard",
  "data": [
    {
      "id": 4,
      "username": "elite_gamer",
      "avatar": "https://...",
      "rating": 1800,
      "games_played": 60,
      "games_won": 45,
      "games_lost": 15
    }
  ]
}
```

### GET /api/users/:id
Profil korisnika po ID.

**Response (200):**
```json
{
  "message": "Profil korisnika",
  "user": { /* user object */ }
}
```

### DELETE /api/users/me
Brisanje trenutnog korisnika (soft delete).

**Headers:** `Authorization: Bearer <token>`

---

## 🎮 Matches Endpoints

### POST /api/matches
Kreiranje novog meča.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "player2_id": "number (required)",
  "winner_id": "number (required, must be player1 or player2)",
  "game_type": "string (optional: 'casual', 'ranked', 'tournament')",
  "game_duration": "number (optional, seconds)",
  "notes": "string (optional, max 500 chars)"
}
```

**Response (201):**
```json
{
  "message": "Meč uspešno kreiran",
  "match_id": 123,
  "rating_changes": {
    "player1": {
      "old_rating": 1000,
      "new_rating": 1020,
      "change": 20
    },
    "player2": {
      "old_rating": 1200,
      "new_rating": 1180,
      "change": -20
    }
  }
}
```

### GET /api/matches
Lista svih meceva sa paginacijom.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 50)

### GET /api/matches/recent
Nedavni mecevi.

**Query Parameters:**
- `limit` (number, default: 5, max: 20)

### GET /api/matches/:id
Detalji meča po ID.

**Response (200):**
```json
{
  "message": "Detalji meča",
  "data": {
    "id": 1,
    "player1_id": 1,
    "player2_id": 2,
    "winner_id": 2,
    "loser_id": 1,
    "player1_rating_before": 1180,
    "player2_rating_before": 1480,
    "player1_rating_after": 1160,
    "player2_rating_after": 1500,
    "rating_change": 20,
    "game_type": "ranked",
    "game_duration": 1800,
    "match_date": "2025-09-19T...",
    "notes": "Intenzivan meč sa velikim obratom",
    "player1_username": "testuser1",
    "player1_avatar": "https://...",
    "player2_username": "gamer_pro",
    "player2_avatar": "https://...",
    "winner_username": "gamer_pro"
  }
}
```

### GET /api/matches/user/:userId
Mecevi određenog korisnika.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 50)

### GET /api/matches/my
Mecevi trenutnog korisnika.

**Headers:** `Authorization: Bearer <token>`

### GET /api/matches/stats/:userId
Statistike određenog korisnika.

**Response (200):**
```json
{
  "message": "Statistike korisnika testuser1",
  "user": {
    "id": 1,
    "username": "testuser1",
    "avatar": "https://...",
    "current_rating": 1200
  },
  "stats": {
    "total_matches": 25,
    "wins": 15,
    "losses": 10,
    "win_rate": "60.00",
    "avg_rating": "1180",
    "avg_game_duration": 1500
  }
}
```

### GET /api/matches/my/stats
Statistike trenutnog korisnika.

**Headers:** `Authorization: Bearer <token>`

---

## 🏥 Health Check

### GET /health
Health check endpoint za monitoring.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running!",
  "timestamp": "2025-09-19T..."
}
```

---

## ⚠️ Error Responses

Svi endpoint-i mogu vratiti sledeće greške:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email mora biti validan"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required",
  "message": "Please provide a valid authentication token"
}
```

### 404 Not Found
```json
{
  "error": "User not found",
  "message": "Korisnik nije pronađen"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Interna greška servera"
}
```

---

## 📊 ELO Rating System

Aplikacija koristi modifikovani ELO rating sistem:

- **Starting Rating**: 1000
- **K-Factor**: 32 (standard)
- **Rating Calculation**: Na osnovu standardne ELO formule
- **Minimum Rating**: Nema (može biti negativan)
- **Maximum Rating**: Nema ograničenja

### Formula:
```
New Rating = Old Rating + K * (Actual Score - Expected Score)

Expected Score = 1 / (1 + 10^((Opponent Rating - Player Rating) / 400))
```

### Primer:
- Player A: 1000 rating
- Player B: 1200 rating  
- Player A pobedi: +28 rating za A, -28 za B
- Player B pobedi: +4 rating za B, -4 za A

---

## 🧪 Testiranje API-ja

### Registracija:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Kreiranje meča:
```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "player2_id": 2,
    "winner_id": 1,
    "game_type": "ranked"
  }'
```