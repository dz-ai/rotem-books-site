import {Handler} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";

// TODO add JWT token
export const handler: Handler = async (event) => {

    const morningApiUrl = process.env.MORNING_URL;

    if (event.httpMethod !== 'POST') {
        return generateResponse(405, 'Method Not Allowed');
    }
    if (!event.body) {
        return generateResponse(400, 'BED REQUEST - request body is missing');
    }
    if (!process.env.MONGODB_COLLECTION_ORDERS) {
        return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');
    }
    if (!morningApiUrl) {
        return generateResponse(500, 'Server configuration error, env variable - MORNING_SANDBOX_URL not found');
    }
    console.log('test');
    try {
        // get the order id and the new status from the frontend
        const {reqId, receiptId, status} = JSON.parse(event.body);

        if (status === 'close' && !receiptId) generateResponse(400, 'Bad request receipt id is missing');

        if (status === 'close' && receiptId) {
            const closeOrderResponse = await fetch(`${morningApiUrl}/documents/${receiptId}/close`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer JWT`,
                },
            });

            if (closeOrderResponse.status !== 200) {
                return generateResponse(closeOrderResponse.status, 'Error closing order');
            }
        }

        // get the order collection from the database
        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const orderCollection = database.collection(process.env.MONGODB_COLLECTION_ORDERS as string);

        // the Db requests values
        const filter = {id: reqId};
        const update = {
            $set: {
                status: status,
            },
        };

        // update the database with the new state and return the updated order
        const databaseResults = await orderCollection.findOneAndUpdate(filter, update, {returnDocument: 'after'});

        if (!databaseResults) {
            return generateResponse(500, `Order update failed`);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newStatus: databaseResults.status}),
        };

    } catch (err) {
        return generateResponse(500, `Internal server Error ${err}`);
    }
}
