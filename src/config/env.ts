import dotenv from "dotenv"
import z from "zod"

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
    PORT: z.preprocess(
        (val) => val === undefined ? undefined : Number(val),
        z.number().int().min(0).max(65535).optional()
    ),
    RESEND_API_KEY: z.string(),
    RESEND_DOMAIN: z.string()
})

const { success, error, data } = envSchema.safeParse(process.env)

if (error) {
    console.error(`Error during validation of .env variables: `, error);
    process.exit(1);
}

export const nodeEnv = {
    NODE_ENV: data.NODE_ENV || "development",
    PORT: data.PORT || 4300,
    MERCEDES_URL: "https://mercedes-benz-certified.it/api/v1/get-searchresults.php",
    IMAGE_BASE_URL: "https://mercedes-benz-certified.it",
    RESEND_API_KEY: data.RESEND_API_KEY,
    RESEND_DOMAIN: data.RESEND_DOMAIN
}