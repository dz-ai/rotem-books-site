import {Handler, HandlerEvent} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {getMorningToken} from "./after-payment-success/get-morning-token.mjs";

export type TOrderItem = {
    id: string,
    documentDate: string,
    client: { name: string },
    status: number
};

// GET ORDERS FROM MORNING API //
const handler: Handler = async (event: HandlerEvent) => {

    if (event.httpMethod !== 'GET') return generateResponse(405, 'Method Not Allowed');

    try {
        const token: string | null = await getMorningToken();
        if (!token) return generateResponse(401, 'token is missing');

        // TODO make fromDate to dynamic var (count maybe 2 month back)
        const documentsSearchParams = {
            type: [400],
            description: 'קניה באתר הספרים של רותם',
            // fromDate: '2024-11-13',
        };

        const response = await fetch(`${process.env.MORNING_URL}/documents/search`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(documentsSearchParams),
        });

        if (response.status !== 200) return generateResponse(response.status, response.statusText);

        const results = await response.json();

        const resultsArray: TOrderItem[] = results.items.map((item: TOrderItem) => {
            return {id: item.id, documentDate: item.documentDate, client: item.client, status: item.status}
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultsArray),
        };

    } catch (err) {
        console.error(err);
        return generateResponse(500, `Internal server Error ${err}`);
    }
}

export {handler};
