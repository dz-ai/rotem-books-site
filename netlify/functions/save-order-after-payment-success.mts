import {Handler} from '@netlify/functions';
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";
import {Collection} from "mongodb";
import {generateResponse, validateRequest} from "../../netlify-functions-util/validateRequest.ts";

// receive the order details from the "morning" webhook API after a successful payment and save them to the database.
const handler: Handler = async (event) => {

    // validate http req is Post and env variables existence
    const validationError = validateRequest(event, 'POST');
    if (validationError) {
        return validationError;
    }

    try {
        if (!event.body) {
            return generateResponse(400, 'BED REQUEST - request Id is missing');
        }

        if (!process.env.MONGODB_COLLECTION_ORDERS) {
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');
        }

        // the Order-Details sent from "morning" API
        const orderDetails = JSON.parse(event.body);

        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const ordersCollection: Collection<Document> = database.collection(process.env.MONGODB_COLLECTION_ORDERS as string);


        const result = await ordersCollection.insertOne(orderDetails);
        console.log(
            `A document was inserted with the _id: ${result.insertedId}`,
        );


        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Data received successfully'}),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error processing request:', error);

        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Invalid request', error: error}),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
}

export {handler};
