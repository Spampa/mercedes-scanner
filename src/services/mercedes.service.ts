import { nodeEnv } from "../config/env.js"
import axios from "axios"
import type { MercedesRequest, MercedesResponse } from "../schemas/mercedes.js"

export async function getCars(body: MercedesRequest, searchValue?: string, ) {
    let page = 0
    let maxPages = -1
    const cars = []

    do {
        body.page = page
        const data = await fetchData(body)
        if (maxPages === -1) {
            maxPages = data.totalPages
        }

        cars.push(...data.data)
        page += 1
    } while (page < maxPages)

    return searchValue ? cars.filter(c => c.carline.includes(searchValue)) : cars;
}

async function fetchData(body: MercedesRequest) {
    const response = await axios.post<MercedesResponse>(
        nodeEnv.MERCEDES_URL,
        body
    )

    return response.data
}