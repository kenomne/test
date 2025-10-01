# Crowbar.gg

Moderna full-stack gaming platforma izgrađena sa Node.js backend i React frontend aplikacijom.

## 📋 Sadržaj

- [O projektu](#o-projektu)
- [Tehnologije](#tehnologije)
- [Instaliranje](#instaliranje)
- [Pokretanje](#pokretanje)
- [Struktura projekta](#struktura-projekta)
- [API dokumentacija](#api-dokumentacija)
- [Razvoj](#razvoj)

## 🎮 O projektu

Crowbar.gg je gaming platforma koja omogućava korisnicima da se povezuju, igraju i učestvuju u gaming zajednici. Aplikacija je dizajnirana sa modernim tehnologijama i najbolje prakse za skalabilnost i performanse.

## 🛠️ Tehnologije

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework za Node.js
- **MySQL2** - MySQL database driver
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **joi** - Data validation
- **CORS** - Cross-Origin Resource Sharing middleware
- **Helmet** - Sigurnosni middleware
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables management

### Database
- **MySQL** - Relational database
- **ELO Rating System** - Chess-style rating calculation
- **User Management** - Registration, login, profiles
- **Match History** - Game results and statistics

### Frontend
- **React 18** - JavaScript library za UI
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client za API pozive
- **CSS3** - Stilizovanje sa modernim CSS

### Development Tools
- **Nodemon** - Auto-restart development server
- **Concurrently** - Pokretanje više npm skriptova istovremeno

## 📦 Instaliranje

### Preduslovi
- Node.js (verzija 16 ili novija)
- npm (dolazi sa Node.js)
- MySQL ili MariaDB server

### Database Setup
Prvo postavite MySQL bazu podataka prema instrukcijama u `DATABASE_SETUP.md`.

### Korak po korak

1. **Kloniranje repozitorijuma**
   ```bash
   git clone <repository-url>
   cd crowbar.gg
   ```

2. **Instaliranje svih dependencies**
   ```bash
   npm run install:all
   ```

   Ova komanda će instalirati dependencies za:
   - Root projekat
   - Backend aplikaciju
   - Frontend aplikaciju

## 🚀 Pokretanje

### Development način rada (preporučeno)

Pokretanje i backend i frontend servera istovremeno:
```bash
npm run dev
```

Ova komanda pokreće:
- Backend server na portu 5000
- Frontend development server na portu 3000

### Pokretanje pojedinačno

**Backend samo:**
```bash
npm run backend:dev
```
Server će biti dostupan na: http://localhost:5000

**Frontend samo:**
```bash
npm run frontend:start
```
Aplikacija će biti dostupna na: http://localhost:3000

### Production pokretanje

1. **Build frontend aplikacije:**
   ```bash
   npm run build
   ```

2. **Pokretanje backend servera:**
   ```bash
   npm run start
   ```

## 📁 Struktura projekta

```
crowbar.gg/
├── backend/                 # Backend aplikacija
│   ├── src/
│   │   ├── routes/         # API rute
│   │   │   └── api.js      # Glavne API rute
│   │   └── index.js        # Entry point za backend
│   ├── .env                # Environment variables
│   ├── .gitignore
│   └── package.json
├── frontend/               # Frontend React aplikacija
│   ├── public/
│   │   ├── index.html      # HTML template
│   │   └── manifest.json   # PWA manifest
│   ├── src/
│   │   ├── components/     # React komponente
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── pages/          # Stranice
│   │   │   ├── Home.js
├── backend/                 # Backend aplikacija
│   ├── src/
│   │   ├── db/             # Database konekcija
│   │   │   └── connection.js
│   │   ├── middleware/     # Auth i validation middleware
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/         # Database modeli
│   │   │   ├── User.js
│   │   │   └── MatchHistory.js
│   │   ├── routes/         # API rute
│   │   │   ├── api.js      # Glavne API rute
│   │   │   ├── auth.js     # Autentifikacija
│   │   │   ├── users.js    # User management
│   │   │   └── matches.js  # Match history
│   │   └── index.js        # Entry point za backend
│   ├── database/           # SQL schema i test podaci
│   │   ├── schema.sql
│   │   └── test_data.sql
│   ├── .env                # Environment variables
│   ├── .gitignore
│   └── package.json
├── frontend/               # Frontend React aplikacija
│   ├── public/
│   │   ├── index.html      # HTML template
│   │   └── manifest.json   # PWA manifest
│   ├── src/
│   │   ├── components/     # React komponente
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── pages/          # Stranice
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── About.js
│   │   │   └── About.css
│   │   ├── styles/         # Globalni stilovi
│   │   │   ├── index.css
│   │   │   └── App.css
│   │   ├── App.js          # Glavna React komponenta
│   │   └── index.js        # Entry point za frontend
│   ├── .gitignore
│   └── package.json
├── .gitignore
├── package.json            # Root package.json
├── README.md               # Ovaj fajl
├── DATABASE_SETUP.md       # Database setup instrukcije
└── SETUP.md                # Brze setup instrukcije

## 🔗 API dokumentacija

### Base URL
```
http://localhost:5000/api
```

### Authentication

Većina endpoint-a zahteva JWT token u Authorization header-u:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### GET /api/
Vraća osnovne informacije o API-ju.

**Response:**
```json
{
  "message": "Dobrodošli na crowbar.gg API!",
  "version": "1.0.0",
  "endpoints": [
    "GET /api/",
    "GET /api/test",
    "GET /health"
  ]
}
```

#### GET /api/test
Test endpoint za proveru API funkcionisanja.

**Response:**
```json
{
  "message": "Test ruta radi!",
  "timestamp": "2025-09-19T...",
  "data": {
    "server": "Node.js Express",
    "status": "active"
  }
}
```

#### POST /api/test
Test endpoint za POST zahteve.

**Request Body:**
```json
{
  "name": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "message": "POST zahtev uspešno obrađen!",
  "received": {
    "name": "...",
    "message": "..."
  },
  "timestamp": "2025-09-19T..."
}
```

#### GET /health
Health check endpoint za monitoring.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running!",
  "timestamp": "2025-09-19T..."
}
```

## 🔧 Razvoj

### Environment variables

Backend koristi sledeće environment variables (`.env` fajl):

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Dodavanje novih ruta

1. Kreirajte novi fajl u `backend/src/routes/`
2. Definirajte rute koristeći Express Router
3. Importujte i koristite rute u `backend/src/index.js`

### Dodavanje novih React komponenti

1. Kreirajte `.js` fajl u `frontend/src/components/`
2. Kreirajte odgovarajući `.css` fajl za stilove
3. Importujte komponentu gde je potrebna

### Scripts dostupni u development

- `npm run dev` - Pokretanje i backend i frontend
- `npm run backend:dev` - Pokretanje samo backend (sa nodemon)
- `npm run frontend:start` - Pokretanje samo frontend
- `npm run build` - Build production verzije frontend
- `npm run install:all` - Instaliranje svih dependencies

## 🤝 Doprinošenje

1. Fork repozitorijum
2. Kreirajte feature branch (`git checkout -b feature/nova-funkcionalnost`)
3. Commit izmene (`git commit -am 'Dodavanje nove funkcionalnosti'`)
4. Push u branch (`git push origin feature/nova-funkcionalnost`)
5. Otvorite Pull Request

## 📄 Licenca

Ovaj projekat je licenciran pod MIT licencom.

## 📞 Kontakt

Za pitanja i podršku, molimo kontaktirajte development tim.

---

**Happy Coding! 🎮**