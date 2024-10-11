import {Handler} from '@netlify/functions';
import cookie from 'cookie';
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";
import {clearInterval} from "node:timers";
import {Collection} from 'mongodb';
import {WithId, Document} from "mongodb";

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
        const {requestId, receiptId} = JSON.parse(event.body);

        // the cookie hold address and cart values even after the redirect to payment form and back
        const cookies = cookie.parse(event.headers.cookie || '');

        let cart = null;
        let address = null;

        if (cookies.cart) cart = JSON.parse(cookies.cart);
        if (cookies.address) address = JSON.parse(cookies.address);

        // get the order collection from the database
        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const orderCollection = database.collection(process.env.MONGODB_COLLECTION_ORDERS as string);

        // get the order with the request ID
        const order = await getOrder(orderCollection, requestId);

        if (order && cart && address) {

            const filter = {id: requestId};
            const update = {
                $set: {
                    cart,
                    payer: {...order.payer, address},
                    status: 'new',
                    date: Date.now(),
                    receiptId: receiptId,
                },
            };

            // update the database with the new values
            await orderCollection.updateOne(filter, update);

        } else {
            return generateResponse(500, `cart or address value is missing`);
        }


        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: 'Client details saved.'}),
        };
    } catch (err) {
        return generateResponse(500, `Internal server Error ${err}`);
    }

};

// as we want to update the order after payment, it might be that the order is not yet saved in the Database
// for that reason we call the order a couple of times with an interval until the order is saved in the Database
function getOrder(orderCollection: Collection, reqId: ClientDetails): Promise<WithId<Document>> {

    return new Promise((resolve, reject) => {

        const intervalId = setInterval(async () => {
            const order = await orderCollection.findOne({id: reqId});

            if (order) {
                clearInterval(intervalId);
                resolve(order);
            }
        }, 700);

        setTimeout(() => {
            clearInterval(intervalId);
            reject('order not found in database');
        }, 15 * 1000);
    });
}
