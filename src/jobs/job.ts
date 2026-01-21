import { getCars } from "../services/mercedes.service.js";
import { TrackingRequestService } from "../services/tracking-request.service.js";
import { HashService } from "../services/hash.service.js";
import { EmailService } from "../services/email.service.js";
import { CompressService } from "../services/compress.service.js";

import nodeCron from "node-cron";

nodeCron.schedule('0 * * * *', () => {
    console.log(`[${new Date().toISOString()}] Esecuzione routine di monitoraggio auto...`)
    job()
})

const trackingRequestService = new TrackingRequestService()
const hashService = new HashService()
const emailService = new EmailService()

export async function job(welcome = false) {
    const trackingRequests = trackingRequestService.getAllRequests()

    trackingRequests.forEach(async r => {
        const cars = await getCars(r.request, r.searchValue)

        const changedCars = cars.filter(c => {
            const hashCars = hashService.createHash(c)

            if (!hashService.isChanged(r.id, c.id, hashCars)) return false

            hashService.addHash(r.id, c.id, hashCars)
            return true;
        })

        if(changedCars.length !== 0) { 
            emailService.sendEmail(await CompressService.compress(changedCars) || "", r.email, changedCars, welcome) 
        }
    })
}