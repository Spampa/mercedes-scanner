import { createHash } from "node:crypto";
import db from "../db/db.js";
import type { MercedesCar } from "../schemas/mercedes.js";

export class HashService {
    createHash(car: MercedesCar): string {
        const jsonString = JSON.stringify(car);
        return createHash('sha256').update(jsonString).digest('hex');
    }

    isChanged(trackingId: number, carId: string, hash: string): boolean {
        const lastHash = db.prepare(`
            SELECT hash_value FROM cars_hash 
            WHERE tracking_request_id = ? AND car_id = ?
            ORDER BY timestamp DESC 
            LIMIT 1
        `).get(trackingId, carId) as { hash_value: string } | undefined;

        return lastHash?.hash_value !== hash;
    }

    addHash(trackingId: number, carId: string, hash: string): void {
        db.prepare(`
            INSERT OR REPLACE INTO cars_hash (tracking_request_id, car_id, hash_value, timestamp)
            VALUES (?, ?, ?, datetime('now'))
        `).run(trackingId, carId, hash);
    }
}