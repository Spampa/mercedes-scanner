# Mercedes Scanner

Sistema di monitoraggio automatico per auto Mercedes certificate.

## Funzionalità

- 🔍 Ricerca personalizzata con filtri (modello, carburante, km, anno, prezzo)
- 📧 Notifiche email automatiche quando vengono trovate nuove auto
- ⏰ Controllo automatico ogni ora
- 🖥️ Interfaccia web per gestire le ricerche
- 🔐 Autenticazione tramite email

## Requisiti

- Node.js 20+
- pnpm 10+
- Account Resend per l'invio email

oppure

- Docker & Docker Compose

## Installazione

### Con Node.js

```bash
# Installa dipendenze
pnpm install

# Copia e configura .env
cp .env.example .env
# Modifica .env con le tue chiavi API

# Build
pnpm run build

# Avvia
pnpm start
```

### Con Docker

```bash
# Build immagine
docker build -t mercedes-scanner .

# Oppure usa docker-compose
docker-compose up -d
```

## Configurazione

Crea un file `.env` nella root del progetto:

```env
PORT=3000
RESEND_API_KEY=re_xxxxxxxxxxxxx
IMAGE_BASE_URL=https://mercedes-benz-certified.it
MERCEDES_URL=https://mercedes-benz-certified.it/api/vehicles
NODE_ENV=production
```

## Utilizzo

1. Apri il browser su `http://localhost:3000`
2. Inserisci la tua email per accedere
3. Crea una nuova ricerca con i filtri desiderati
4. Riceverai email automatiche quando vengono trovate nuove auto

## Comandi Docker

```bash
# Build
docker build -t mercedes-scanner .

# Run
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --env-file .env \
  --name mercedes-scanner \
  mercedes-scanner

# Con docker-compose
docker-compose up -d           # Avvia in background
docker-compose down            # Ferma
docker-compose logs -f         # Visualizza logs
docker-compose restart         # Riavvia
```

## Struttura Progetto

```
├── src/
│   ├── db/              # Database SQLite
│   ├── jobs/            # Job cron per controllo automatico
│   ├── schemas/         # Schema Zod per validazione
│   ├── services/        # Logica business (email, tracking, mercedes)
│   ├── static/          # Template EJS
│   └── index.ts         # Server Express
├── data/                # Database SQLite (creato automaticamente)
├── Dockerfile           # Build Docker
├── docker-compose.yml   # Orchestrazione Docker
└── .env                 # Configurazione (da creare)
```

## License

ISC
