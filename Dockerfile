# Stage 1: Build
FROM node:20-alpine AS builder

# Abilita corepack per pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia file di configurazione
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# Installa dipendenze (incluse devDependencies per il build)
RUN pnpm install --frozen-lockfile

# Copia codice sorgente
COPY src ./src

# Build TypeScript
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

# Abilita corepack per pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia file di configurazione
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installa solo dipendenze di produzione
RUN pnpm install --frozen-lockfile --prod

# Copia build dalla fase precedente
COPY --from=builder /app/dist ./dist

# Copia file statici (views EJS)
COPY views ./views

# Crea cartella data per il database
RUN mkdir -p data

# Espone la porta (default 3000, sovrascrivibile con env)
EXPOSE 3000

# Avvia l'applicazione
CMD ["node", "dist/index.js"]
