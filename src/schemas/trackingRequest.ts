import { MercedesRequestSchema } from "./mercedes.js"
import z from "zod"

export const TrackingRequestSchema = z.object({
    id: z.number(),
    email: z.email(),
    request: MercedesRequestSchema,
    searchValue: z.string().optional()
})

export const CreateTrackingRequestSchema = z.object({
    email: z.email(),
    searchValue: z.string().optional(),
    request: MercedesRequestSchema
})

export type TrackingRequest = z.infer<typeof TrackingRequestSchema>
export type CreateTrackingRequest = z.infer<typeof CreateTrackingRequestSchema>