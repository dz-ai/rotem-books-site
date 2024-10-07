import {Handler} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";

// TODO add JWT token
export const handler: Handler = async (event) => {

    if (event.httpMethod !== 'GET') {
        return generateResponse(405, 'Method Not Allowed');
    }
    if (!process.env.MONGODB_COLLECTION_ORDERS) {
        return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');
    }

    try {

        // get the order collection from the database
        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const orderCollection = database.collection(process.env.MONGODB_COLLECTION_ORDERS as string);

        // get the whole "Order" list from the collection
        const orders = await orderCollection.find({}).toArray();

        let results = null;

        if (orders) {
            results = orders;
        } else {
            return generateResponse(500, 'fail to get "Orders" from Database');
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(results),
        };

    } catch (err) {
        return generateResponse(500, `Internal server Error ${err}`);
    }
}
