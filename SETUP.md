# Crowbar.gg - Lokalne instrukcije za pokretanje

## Brzo pokretanje

### 1. Instaliranje dependencies

```bash
# U root direktorijumu
npm run install:all
```

### 2. Pokretanje development servera

```bash
# Pokretanje i backend i frontend istovremeno
npm run dev
```

**Ili pojedinačno:**

```bash
# Backend samo (port 5000)
npm run backend:dev

# Frontend samo (port 3000) 
npm run frontend:start
```

### 3. Pristup aplikaciji

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/health

## Testiranje da li sve radi

1. Otvorite http://localhost:3000
2. Na početnoj stranici videćete "API Test" sekciju
3. Ako se prikaže JSON odgovor, backend i frontend su uspešno povezani

## Struktura portova

- **Frontend (React):** Port 3000
- **Backend (Node.js):** Port 5000
- **Proxy:** Frontend automatski prosleđuje `/api` pozive na backend

## Česti problemi

### Port već u upotrebi
```bash
# Proverite koji proces koristi port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Ubijte proces ako je potrebno
taskkill /PID <PID> /F
```

### Dependencies greške
```bash
# Očistite node_modules i reinstalirajte
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json  
rm -rf frontend/node_modules frontend/package-lock.json
npm run install:all
```

### CORS greške
Proverite da li je backend pokrenut na portu 5000 i da frontend koristi proxy u `package.json`.

## Environment setup

Backend automatski koristi environment variables iz `.env` fajla:
```
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Development tipovi

- Promene u backend fajlovima će se automatski restartovati (nodemon)
- Promene u frontend fajlovima će se automatski reloadovati u browseru
- Console.log poruke iz backend možete videti u terminalu
- React Developer Tools se preporučuje za frontend debugging