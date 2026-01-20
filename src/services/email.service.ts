import type { MercedesCar } from "../schemas/mercedes.js";
import { Resend } from 'resend';
import { nodeEnv } from "../config/env.js";

const resend = new Resend(nodeEnv.RESEND_API_KEY);
const IMAGE_BASE_URL = nodeEnv.IMAGE_BASE_URL || '';

export class EmailService {
    private formatCarTable(car: MercedesCar): string {
        const imageUrl = `${IMAGE_BASE_URL}${car.photo}`;

        return `
            <div style="margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <img src="${imageUrl}" alt="${car.brand} ${car.model}" style="width: 100%; max-height: 300px; object-fit: cover;">
                <div style="padding: 20px;">
                    <h2 style="margin-top: 0; margin-bottom: 15px; color: #333;">${car.carline}</h2>
                    <div style="margin-bottom: 25px;">
                        <table style="width: 100%; border-collapse: separate; border-spacing: 15px 0;">
                            <tr>
                                <td style="width: 33.33%; background-color: #fff3cd; padding: 12px 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
                                    <div style="font-size: 12px; color: #856404; font-weight: bold; margin-bottom: 4px;">💰 PREZZO</div>
                                    <div style="font-size: 20px; font-weight: bold; color: #856404;">${car.price}€</div>
                                </td>
                                <td style="width: 33.33%; background-color: #d1ecf1; padding: 12px 15px; border-radius: 6px; border-left: 4px solid #17a2b8;">
                                    <div style="font-size: 12px; color: #0c5460; font-weight: bold; margin-bottom: 4px;">📅 IMMATRICOLAZIONE</div>
                                    <div style="font-size: 18px; font-weight: bold; color: #0c5460;">${car.registration}</div>
                                </td>
                                <td style="width: 33.33%; background-color: #d4edda; padding: 12px 15px; border-radius: 6px; border-left: 4px solid #28a745;">
                                    <div style="font-size: 12px; color: #155724; font-weight: bold; margin-bottom: 4px;">🚗 CHILOMETRI</div>
                                    <div style="font-size: 18px; font-weight: bold; color: #155724;">${car.km.toLocaleString()} km</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Modello</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.model}</td>
                        </tr>
                                                <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Garanzia</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.warranty}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Concessionario</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.dealer}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Indirizzo</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.dealerAddress}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Cambio</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.gearbox}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Carburante</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.fuel}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Euro</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${car.euro}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 30px;">
                        <table style="width: 100%; border-collapse: separate; border-spacing: 20px 0;">
                            <tr>
                                <td style="width: 50%; text-align: center;">
                                    <a href="${IMAGE_BASE_URL}${car.link}" style="display: block; padding: 16px 40px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Visualizza Auto</a>
                                </td>
                                <td style="width: 50%; text-align: center;">
                                    <a href="${IMAGE_BASE_URL}${car.dealerLink}" style="display: block; padding: 16px 40px; background-color: #5cb85c; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Contatta Concessionario</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    private formatEmailHtml(cars: Array<MercedesCar>, welcome: boolean): string {
        const carsHtml = cars.map(car => this.formatCarTable(car)).join('');
        
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

    sendEmail(email: string, cars: Array<MercedesCar>, welcome = false) {
        const htmlContent = this.formatEmailHtml(cars, welcome);

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