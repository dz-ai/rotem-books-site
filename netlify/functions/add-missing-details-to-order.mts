import {Handler} from '@netlify/functions';
import cookie from 'cookie';
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";

interface ClientDetails {
    phone: string;
    address: string;
    email: string;
}

// add address and cart values to order
export const handler: Handler = async (event) => {

    if (event.httpMethod !== 'POST') {
        return generateResponse(405, 'Method Not Allowed');
    }
    if (!event.body) {
        return generateResponse(400, 'BED REQUEST - request body is missing');
    }
    if (!process.env.MONGODB_COLLECTION_ORDERS) {
        return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');
    }

    try {
        // get the order id from the frontend (payment successful page)
        const reqId: ClientDetails = JSON.parse(event.body);

        // the cookie hold address and cart values even after the redirect to payment form and back
        const cookies = cookie.parse(event.headers.cookie || '');

        let cart = null;
        let address = null;

        if (cookies.cart && cookies.address) {
            cart = JSON.parse(cookies.cart);
            address = JSON.parse(cookies.address);
        }

        // get the order collection from the database
        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const orderCollection = database.collection(process.env.MONGODB_COLLECTION_ORDERS as string);

        // get the order with id
        let order = await orderCollection.findOne({id: reqId});

        let results = null;

        if (order && cart) {

            const filter = {id: reqId};
            const update = {
                $set: {
                    cart,
                    payer: {...order.payer, address},
                },
            };

            // update the database with the new values
            results = await orderCollection.updateOne(filter, update);

        } else {
            return generateResponse(500, `cart or address value is missing`);
        }


        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: 'Client details saved.', order, results}),
        };
    } catch (err) {
        return generateResponse(500, `Internal server Error ${err}`);
    }

};
