import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import fs from 'node:fs';

const dataDir = './data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db: DatabaseType = new Database('./data/mercedes.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.prepare(`
    CREATE TABLE IF NOT EXISTS tracking_request (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        search TEXT,
        model TEXT,
        fuel TEXT,
        kilometer_min INTEGER DEFAULT 0,
        kilometer_max INTEGER DEFAULT 200000,
        year_min INTEGER DEFAULT 2020,
        year_max INTEGER DEFAULT 2026,
        price_min INTEGER DEFAULT 0,
        price_max INTEGER DEFAULT 29000,
        order_by TEXT DEFAULT 'price',
        order_dir TEXT DEFAULT 'ASC',
        page INTEGER DEFAULT 0
    )    
`).run()

db.prepare(`
    CREATE TABLE IF NOT EXISTS cars_price (
        car_id TEXT NOT NULL,
        price TEXT NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (car_id, timestamp)
    )    
`).run()

process.on('exit', () => db.close());
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

export default db