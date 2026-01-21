import type { MercedesCar } from "../schemas/mercedes.js";
import zlib from "zlib"
import { promisify } from "util";

const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

export class CompressService {
    private static readonly map = {
        "id": "i",
        "brand": "b",
        "model": "m",
        "carline": "c",
        "registration": "r",
        "km": "k",
        "etaxcode": "ex",
        "promo": "p",
        "price": "pr",
        "gearbox": "g",
        "fuel": "f",
        "co2": "co",
        "euro": "e",
        "consumption": "cm",
        "warranty": "w",
        "dealer": "d",
        "dealerAddress": "da",
        "dealerLink": "dl",
        "link": "l",
        "photo": "ph"
    } as const;

    private static readonly invertedMap = Object.fromEntries(
        Object.entries(this.map).map(([k, v]) => [v, k])
    );

    private static changeKey(cars: Array<any>, map: Record<string, string>) {
        return cars.map(c => {
            return Object.keys(c).reduce((acc, key) => {
                const newKey = map[key] || key;
                acc[newKey] = c[key];
                return acc;
            }, {} as Record<string, any>)
        })
    }

    static async compress(cars: Array<MercedesCar>) {
        try {
            const minimizedData = JSON.stringify(CompressService.changeKey(cars, CompressService.map))

            const buffer = await brotliCompress(minimizedData, {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11
                }
            })

            return buffer.toString('base64url');
        }catch(error){
            console.error(error)
        }
    }

    static async decompress(data: string): Promise<Array<MercedesCar> | undefined> {
        try {
            const buffer = await brotliDecompress(Buffer.from(data, 'base64url'))
            return CompressService.changeKey(JSON.parse(buffer.toString()), CompressService.invertedMap) as Array<MercedesCar>;
        } catch (error) {
            console.error(error)
        }
    }

}