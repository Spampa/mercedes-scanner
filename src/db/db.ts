import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'node:path';
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
    CREATE TABLE IF NOT EXISTS cars_hash (
        tracking_request_id INTEGER NOT NULL,
        car_id TEXT NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        hash_value TEXT NOT NULL,
        PRIMARY KEY (tracking_request_id, car_id),
        FOREIGN KEY (tracking_request_id) REFERENCES tracking_request(id) ON DELETE CASCADE
    )    
`).run()

process.on('exit', () => db.close());
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

export default db