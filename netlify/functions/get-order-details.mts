import {Handler} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {getMorningToken} from "./after-payment-success/get-morning-token.mjs";

export interface IIncomeItem {
    description: string; // book title
    quantity: number;
    price: number;
    amountTotal: number; // total per item
}

interface IGetOrderResultsClient {
    name: string;
    address: string;
    city: string;
    zip: string;
    phone: string;
    emails: string[];
}

export interface IGetOrderResults {
    id: string;
    status: number;
    documentDate: string;
    client: IGetOrderResultsClient
    income: IIncomeItem[]; // cart (items)
    amountLocal: number; // total price
    url: { origin: string, he: string }; // receipt origin - ״מקור״, he - ״העתק״
}

const handler: Handler = async (event) => {

    if (!event.body) return generateResponse(400, 'BED REQUEST - request body is missing');

    // get the order id
    const orderId = JSON.parse(event.body);

    const token = await getMorningToken();
    if (!token) return generateResponse(401, 'token is missing');

    try {
        const getOrderResponse = await fetch(`${process.env.MORNING_URL}/documents/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const getOrderResults = await getOrderResponse.json();

        // ERROR HANDLING //
        if (getOrderResponse.status !== 200) {
            console.error('Error: ', getOrderResults.errorCode, getOrderResults.errorMessage);
            return generateResponse(getOrderResponse.status, getOrderResults.errorMessage);
        }

        // SUCCESS HANDLING //
        const results: IGetOrderResults = {
            id: getOrderResults.id,
            status: getOrderResults.status,
            client: getOrderResults.client,
            documentDate: getOrderResults.documentDate,
            income: getOrderResults.income,
            url: getOrderResults.url,
            amountLocal: getOrderResults.amountLocal,
        }

        return {
            statusCode: 200,
            body: JSON.stringify(results),
        }

    } catch (err) {
        console.error(err);
        return generateResponse(500, `Error: ${err}`);
    }
}

export {handler};
