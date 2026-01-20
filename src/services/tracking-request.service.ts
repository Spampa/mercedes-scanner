import db from "../db/db.js";
import type { MercedesRequest } from "../schemas/mercedes.js";
import type { TrackingRequest } from "../schemas/trackingRequest.js";

export class TrackingRequestService {
    createRequest(email: string, searchValue: string, request: MercedesRequest): TrackingRequest {
        const result = db.prepare(`
            INSERT INTO tracking_request (
                email, search, model, fuel, kilometer_min, kilometer_max,
                year_min, year_max, price_min, price_max,
                order_by, order_dir, page
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            email,
            searchValue ?? null,
            request.model.join(','),
            request.fuel.join(','),
            request.kilometerMin,
            request.kilometerMax,
            request.yearMin,
            request.yearMax,
            request.priceMin,
            request.priceMax,
            request.orderBy,
            request.orderDir,
            request.page
        );

        const id = result.lastInsertRowid as number;
        const createdRequest = this.getRequest(id);
        
        if (!createdRequest) {
            throw new Error("Failed to retrieve created tracking request");
        }
        
        return createdRequest;
    }

    getRequest(id: number): TrackingRequest | undefined {
        const row = db.prepare(`
            SELECT * FROM tracking_request WHERE id = ?
        `).get(id) as {
            id: number;
            email: string;
            search: string | null;
            model: string;
            fuel: string;
            kilometer_min: number;
            kilometer_max: number;
            year_min: number;
            year_max: number;
            price_min: number;
            price_max: number;
            order_by: string;
            order_dir: string;
            page: number;
        } | undefined;

        if (!row) return undefined;

        return {
            id: row.id,
            email: row.email,
            searchValue: row.search ?? undefined,
            request: {
                model: row.model ? row.model.split(',') : [],
                fuel: row.fuel ? row.fuel.split(',') : [],
                kilometerMin: row.kilometer_min,
                kilometerMax: row.kilometer_max,
                yearMin: row.year_min,
                yearMax: row.year_max,
                priceMin: row.price_min,
                priceMax: row.price_max,
                orderBy: row.order_by as "price" | "immatricolation" | "km" | "published",
                orderDir: row.order_dir as "ASC" | "DESC",
                page: row.page
            }
        };
    }

    getAllRequests(): Array<TrackingRequest> {
        const rows = db.prepare(`
            SELECT * FROM tracking_request
        `).all() as Array<{
            id: number;
            email: string;
            search: string | null;
            model: string;
            fuel: string;
            kilometer_min: number;
            kilometer_max: number;
            year_min: number;
            year_max: number;
            price_min: number;
            price_max: number;
            order_by: string;
            order_dir: string;
            page: number;
        }>;

        return rows.map(row => ({
            id: row.id,
            email: row.email,
            searchValue: row.search ?? undefined,
            request: {
                model: row.model ? row.model.split(',') : [],
                fuel: row.fuel ? row.fuel.split(',') : [],
                kilometerMin: row.kilometer_min,
                kilometerMax: row.kilometer_max,
                yearMin: row.year_min,
                yearMax: row.year_max,
                priceMin: row.price_min,
                priceMax: row.price_max,
                orderBy: row.order_by as "price" | "immatricolation" | "km" | "published",
                orderDir: row.order_dir as "ASC" | "DESC",
                page: row.page
            }
        }));
    }

    getRequestsByEmail(email: string): Array<TrackingRequest> {
        const rows = db.prepare(`
            SELECT * FROM tracking_request WHERE email = ?
        `).all(email) as Array<{
            id: number;
            email: string;
            search: string | null;
            model: string;
            fuel: string;
            kilometer_min: number;
            kilometer_max: number;
            year_min: number;
            year_max: number;
            price_min: number;
            price_max: number;
            order_by: string;
            order_dir: string;
            page: number;
        }>;

        return rows.map(row => ({
            id: row.id,
            email: row.email,
            searchValue: row.search ?? undefined,
            request: {
                model: row.model ? row.model.split(',') : [],
                fuel: row.fuel ? row.fuel.split(',') : [],
                kilometerMin: row.kilometer_min,
                kilometerMax: row.kilometer_max,
                yearMin: row.year_min,
                yearMax: row.year_max,
                priceMin: row.price_min,
                priceMax: row.price_max,
                orderBy: row.order_by as "price" | "immatricolation" | "km" | "published",
                orderDir: row.order_dir as "ASC" | "DESC",
                page: row.page
            }
        }));
    }

    deleteRequest(id: number): boolean {
        const result = db.prepare(`
            DELETE FROM tracking_request WHERE id = ?
        `).run(id);

        return result.changes > 0;
    }
}