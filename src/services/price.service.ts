import db from "../db/db.js";
import type { MercedesCar } from "../schemas/mercedes.js";

export class PriceService {
    getAllPricesBycarId(carId: string): { car_id: string; price: string; timestamp: string }[] {
        const prices = db.prepare(`
            SELECT car_id, price, timestamp FROM cars_price
            WHERE car_id = ?   
            ORDER BY timestamp ASC
        `).all(carId) as { car_id: string; price: string; timestamp: string }[];
        
        return prices;
    }

    getLastPrice(carId: string): string | undefined {
        const lastPrice = db.prepare(`
            SELECT price FROM cars_price
            WHERE car_id = ?
            ORDER BY timestamp DESC 
            LIMIT 1
        `).get(carId) as { price: string } | undefined;

        return lastPrice?.price;
    }

    addPrice(carId: string, price: string): void {
        db.prepare(`
            INSERT OR REPLACE INTO cars_price (car_id, price, timestamp)
            VALUES (?, ?, datetime('now'))
        `).run(carId, price);
    }
}