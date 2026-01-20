import z from "zod";

export const MercedesCarSchema = z.object({
    id: z.string(),
    brand: z.string(),
    model: z.string(),
    carline: z.string(),
    registration: z.string(),
    km: z.number(),
    etaxcode: z.string(),
    promo: z.string(),
    price: z.string(),
    gearbox: z.string(),
    fuel: z.string(),
    co2: z.number(),
    euro: z.string(),
    consumption: z.string(),
    warranty: z.string(),
    dealer: z.string(),
    dealerAddress: z.string(),
    dealerLink: z.string(),
    link: z.string(),
    photo: z.string()
})

export const MercedesStatusSchema = z.object({
    status: z.string(),
    code: z.number(),
    msg: z.string()
})

export const MercedesResponseSchema = z.object({
    result: MercedesStatusSchema,
    data: z.array(MercedesCarSchema),
    totalResults: z.number(),
    totalPages: z.number()
})

export const MercedesRequestSchema = z.object({
    model: z.array(z.string()),
    fuel: z.array(z.string()),
    kilometerMin: z.number().min(0),
    kilometerMax: z.number().max(475000),
    yearMin: z.number().int().min(2015),
    yearMax: z.number().int().min(2015),
    priceMin: z.number().min(9500).default(9500),
    priceMax: z.number().min(9500),
    page: z.number().min(0).default(0),
    orderBy: z.enum(["price", "immatricolation", "km", "published"]),
    orderDir: z.enum(["ASC", "DESC"])
})

export type MercedesCar = z.infer<typeof MercedesCarSchema>;
export type MercedesStatus = z.infer<typeof MercedesStatusSchema>
export type MercedesResponse = z.infer<typeof MercedesResponseSchema>
export type MercedesRequest = z.infer<typeof MercedesRequestSchema>