import type { MercedesCar } from "../schemas/mercedes.js";
import { Resend } from 'resend';
import { nodeEnv } from "../config/env.js";

const resend = new Resend(nodeEnv.RESEND_API_KEY);
const IMAGE_BASE_URL = nodeEnv.IMAGE_BASE_URL || '';

export class EmailService {
    private formatCarTable(car: MercedesCar): string {
        const imageUrl = `${IMAGE_BASE_URL}${car.photo}`;

        return `
            <div class="car-item" style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; display: flex; background-color: white;">
                <img src="${imageUrl}" alt="${car.brand} ${car.model}" class="car-image" style="width: 200px; height: 150px; object-fit: cover;">
                <div class="car-content" style="padding: 15px; flex: 1;">
                    <h3 class="car-title" style="margin: 0 0 10px 0; color: #333;">${car.carline}</h3>
                    <table class="car-info-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px; font-weight: bold; color: #333; font-size: 13px;">Prezzo</td>
                            <td style="padding: 8px; color: #666; font-size: 13px;">${car.price}€</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px; font-weight: bold; color: #333; font-size: 13px;">Anno</td>
                            <td style="padding: 8px; color: #666; font-size: 13px;">${car.registration}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px; font-weight: bold; color: #333; font-size: 13px;">KM</td>
                            <td style="padding: 8px; color: #666; font-size: 13px;">${car.km.toLocaleString()}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px; font-weight: bold; color: #333; font-size: 13px;">Cambio</td>
                            <td style="padding: 8px; color: #666; font-size: 13px;">${car.gearbox}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold; color: #333; font-size: 13px;">Carburante</td>
                            <td style="padding: 8px; color: #666; font-size: 13px;">${car.fuel}</td>
                        </tr>
                    </table>
                    <a href="${IMAGE_BASE_URL}${car.link}" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Visualizza</a>
                </div>
            </div>
        `;
    }

    private formatEmailHtml(cars: Array<MercedesCar>, welcome: boolean, compressedData: string): string {
        const displayCars = cars.slice(0, 5);
        const hasMore = cars.length > 5;
        const carsHtml = displayCars.map(car => this.formatCarTable(car)).join('');
        const viewAllButton = hasMore ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="htp://${nodeEnv.DOMAIN}:${nodeEnv.PORT}/report?data=${encodeURIComponent(compressedData)}" style="display: inline-block; padding: 15px 40px; background-color: #28a745; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">📋 Visualizza tutte le ${cars.length} auto</a>
            </div>
        ` : '';
        
        const welcomeMessage = welcome ? `
            <div style="background-color: #d1f2eb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 5px solid #28a745;">
                <h2 style="color: #155724; margin-top: 0; font-size: 24px;">👋 Benvenuto nel servizio Mercedes Scanner!</h2>
                <p style="color: #155724; font-size: 16px; margin-bottom: 10px;">
                    Grazie per esserti iscritto al nostro servizio di monitoraggio auto Mercedes. 
                </p>
                <p style="color: #155724; font-size: 16px; margin-bottom: 10px;">
                    Ti invieremo aggiornamenti automatici ogni volta che troveremo nuove auto che corrispondono ai tuoi criteri di ricerca.
                </p>
                <p style="color: #155724; font-size: 16px; margin: 0;">
                    Ecco il tuo primo report con le auto attualmente disponibili:
                </p>
            </div>
        ` : '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${welcome ? 'Benvenuto - Mercedes Scanner' : 'Nuove Auto Mercedes Disponibili'}</title>
                <style>
                    @media only screen and (max-width: 600px) {
                        .car-item {
                            display: block !important;
                        }
                        .car-image {
                            width: 100% !important;
                            height: 200px !important;
                        }
                        .car-title {
                            font-size: 1.1rem !important;
                        }
                    }
                </style>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: white; padding: 30px; border-radius: 10px;">
                    <h1 style="color: #0066cc; text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">
                        🚗 ${welcome ? 'Benvenuto - Mercedes Scanner' : 'Nuove Auto Mercedes Disponibili'}
                    </h1>
                    ${welcomeMessage}
                    <p style="text-align: center; color: #666; font-size: 16px;">
                        ${welcome ? 'Abbiamo trovato' : 'Ci sono'} ${cars.length} auto che corrispondono ai tuoi criteri di ricerca.
                    </p>
                    ${hasMore ? `<p style="text-align: center; color: #666; font-size: 14px;">Mostrando le prime 5 auto</p>` : ''}
                    ${viewAllButton}
                    ${carsHtml}
                    <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; text-align: center;">
                        <p style="margin: 0; color: #666;">
                            Questa è una email automatica dal servizio di monitoraggio Mercedes Scanner.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    sendEmail(compressedData: string, email: string, cars: Array<MercedesCar>, welcome = false) {
        const htmlContent = this.formatEmailHtml(cars, welcome, compressedData);

        resend.emails.send({
            from: `Mercedes Scanner <update@${nodeEnv.RESEND_DOMAIN}>`,
            to: email,
            subject: welcome 
                ? `🎉 Benvenuto su Mercedes Scanner - ${cars.length} auto trovate!`
                : `🚗 ${cars.length} ${cars.length === 1 ? 'Nuova Auto Mercedes Trovata' : 'Nuove Auto Mercedes Trovate'}`,
            html: htmlContent
        });
    }
}