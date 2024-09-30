import {Handler} from "@netlify/functions";
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";
import {generateResponse, validateRequest} from "../../netlify-functions-util/validateRequest.ts";

// get the order id from the "payment-success-page" and send back the receipt url
// that allow the user to download the receipt
const handler: Handler = async (event) => {
    const validationError = validateRequest(event, 'POST');
    if (validationError) {
        return validationError;
    }

    try {
        if (!event.body) {
            return generateResponse(400, 'BED REQUEST - request body is missing');
        }

        if (!process.env.MONGODB_COLLECTION_ORDERS) {
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');
        }

        if (!process.env.MONGODB_COLLECTION_RECEIPTS) {
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_RECEIPTS not found');
        }

        // get the order id from the frontend (payment successful page)
        const reqId = JSON.parse(event.body);

        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);

        // get first the order that contain the transaction id which is the only thing that we can use to find the receipt later
        const orderCollection = database.collection(process.env.MONGODB_COLLECTION_ORDERS as string);
        const order = await orderCollection.findOne({id: reqId});

        let results = null;

        // if we find the order, we can then extract the transaction id and to use it to find the relevant receipt
        if (order) {
            const transactions: { id: string }[] = order.transactions;

            const transactionId: string = transactions[0].id;

            const receiptsCollection = database.collection(process.env.MONGODB_COLLECTION_RECEIPTS as string);

            const receipt = await receiptsCollection.findOne({transaction_id: transactionId});

            // if we find the receipt, we send the url that allow the user to download the receipt
            if (receipt) results = receipt.url;
        }

        return {
            statusCode: 200,
            body: JSON.stringify(results),
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: 'error' + err
        }
    }
}

export {handler};
