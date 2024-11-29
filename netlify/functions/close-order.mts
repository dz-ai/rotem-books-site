import {Handler, HandlerEvent} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {getMorningToken} from "./after-payment-success/get-morning-token.mjs";

// MOVE ORDER STATUS IN THE "MORNING SYSTEM" TO CLOSE.
const handler: Handler = async (event: HandlerEvent) => {

    const morningApiUrl = process.env.MORNING_URL;
    const token: string | null = await getMorningToken();

    if (event.httpMethod !== 'GET') return generateResponse(405, 'Method Not Allowed');
    if (!event.queryStringParameters) return generateResponse(400, 'Bad request order id is missing');
    if (!morningApiUrl) return generateResponse(500, 'Server configuration error, env variable - MORNING_URL not found');
    if (!token) return generateResponse(401, 'Morning-Token generation failed');

    const {orderId} = event.queryStringParameters;

    try {
        const closeOrderResponse = await fetch(`${morningApiUrl}/documents/${orderId}/close`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (closeOrderResponse.status !== 200) return generateResponse(closeOrderResponse.status, 'Error closing order');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        };

    } catch (err) {
        return generateResponse(500, `Internal server Error ${err}`);
    }
}

export {handler};
