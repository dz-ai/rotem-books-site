import {Handler} from '@netlify/functions';
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";
import {Collection} from "mongodb";
import {generateResponse, validateRequest} from "../../netlify-functions-util/validateRequest.ts";

// receive the "notification" from "morning" API and save it to Receipt-Storage in the database.
const handler: Handler = async (event) => {
    const validationError = validateRequest(event, 'POST');
    if (validationError) {
        return validationError;
    }

    try {
        if (!event.body) {
            return generateResponse(400, 'BED REQUEST - request body is missing');
        }

        if (!process.env.MONGODB_COLLECTION_RECEIPTS) {
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_RECEIPTS not found');
        }

        // the notification comes as a very long string. and have to be processed to an Object
        const receiptObj: Record<string, string> = queryStringToObject(event.body);

        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const receiptsCollection: Collection<Record<string, string>> = database.collection(process.env.MONGODB_COLLECTION_RECEIPTS as string);

        await receiptsCollection.insertOne(receiptObj);

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

// processing the string that arrive from the "morning" API notification to an Object
function queryStringToObject(queryString: string): Record<string, string> {
    return queryString.split('&')
        .reduce((acc, param) => {

            const [key, value] = param.split('=');
            //  some of the val comes as coded URL (% in the urls gaps or symbols) so hear as we assign key val pairs to our Obj we decoded them
            acc[decodeURIComponent(key)] = decodeURIComponent(value);

            return acc;
        }, {} as Record<string, string>);
}

export {handler};
