import { getCars } from "../services/mercedes.service.js";
import { TrackingRequestService } from "../services/tracking-request.service.js";
import { PriceService } from "../services/price.service.js";
import { EmailService } from "../services/email.service.js";
import { CompressService } from "../services/compress.service.js";

import nodeCron from "node-cron";
import type { TrackingRequest } from "../schemas/trackingRequest.js";

nodeCron.schedule('0 * * * *', () => {
    console.log(`[${new Date().toISOString()}] Esecuzione routine di monitoraggio auto...`)
    job()
})

const trackingRequestService = new TrackingRequestService()
const priceService = new PriceService()
const emailService = new EmailService()

console.log(`[${new Date().toISOString()}] Avvio iniziale - esecuzione job di monitoraggio...`)
job()

export async function job() {
    const trackingRequests = trackingRequestService.getAllRequests()

    trackingRequests.forEach( r => {
        singleJob(r)
    })
}

export async function singleJob(request: TrackingRequest, welcome = false) {
    const cars = await getCars(request.request, request.searchValue);

    const changedCars = cars.filter(c => {
        const lastPrice = priceService.getLastPrice(c.id);

        if (!lastPrice || lastPrice > c.price) {
            priceService.addPrice(c.id, c.price)
            return true
        }
        else if (lastPrice !== c.price) {
            priceService.addPrice(c.id, c.price)
        }
        return false;
    })

    if (welcome) {
        emailService.sendEmail(await CompressService.compress(cars) || "", request.email, cars, welcome)
    }
    else if (changedCars.length !== 0) {
        emailService.sendEmail(await CompressService.compress(changedCars) || "", request.email, changedCars, welcome)
    }
}