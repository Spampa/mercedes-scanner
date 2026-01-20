import express from "express"
import path from "path"
import { fileURLToPath } from 'url'
import { TrackingRequestService } from "./services/tracking-request.service.js";
import z from "zod";
import { CreateTrackingRequestSchema } from "./schemas/trackingRequest.js";
import { job } from "./jobs/job.js";
import { nodeEnv } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const port = nodeEnv.PORT

// Configurazione EJS
app.set('view engine', 'ejs')
app.set('views', path.join('views'))

app.use(express.json())

const trackingService = new TrackingRequestService()

// Route per le pagine
app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/tracking', (req, res) => {
    res.render('tracking')
})

app.get('/create-tracking', (req, res) => {
    res.render('create-tracking')
})

app.use((req, res, next) => {
    const allowedMethods = ["GET", "POST", "DELETE"]
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    
    if (!allowedMethods.includes(req.method)) {
        res.status(405).json({
            status: "error",
            message: "Method not allowed",
            allowedMethods
        })
        return
    }
    next()
})

app.get("/tracking-requests/:id", (req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        res.status(400).json({ status: "error", message: "id is not a number"})
    }

    const request = trackingService.getRequest(id)
    res.status(200).json(request)
})

app.get("/tracking-requests/by-email/:email", (req, res) => {
    const email = req.params.email
    
    const emailSchema = z.email()
    const validation = emailSchema.safeParse(email)
    
    if (!validation.success) {
        res.status(400).json({ 
            status: "error", 
            message: "Invalid email format"
        })
        return
    }

    const requests = trackingService.getRequestsByEmail(email)

    if(requests.length === 0){
        res.status(404).json({ message: "email not found" })
        return;
    }

    res.status(200).json({
        status: "success",
        count: requests.length,
        data: requests
    })
})

app.post("/tracking-requests", (req, res) => {
    const validation = CreateTrackingRequestSchema.safeParse(req.body)
    
    if (!validation.success) {
        res.status(400).json({ 
            status: "error", 
            message: "Invalid request body",
            errors: validation.error 
        })
        return
    }

    const { email, searchValue, request } = validation.data
    const trackingRequest = trackingService.createRequest(email, searchValue ?? "", request)
    
    res.status(201).json(trackingRequest)
    job(true)
})

app.delete("/tracking-requests/:id", (req, res) => {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
        res.status(400).json({ 
            status: "error", 
            message: "id is not a number"
        })
        return
    }

    trackingService.deleteRequest(id)
    
    res.status(204).json()
})

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
    console.log(`Website at: http://localhost:${4300}/`)
})

