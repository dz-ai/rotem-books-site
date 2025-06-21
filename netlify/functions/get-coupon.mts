import {Handler} from '@netlify/functions';
import {mongoClientPromise} from "../../netlify-functions-util/mongoDB-connection.ts";
import {Collection, WithId} from "mongodb";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {ICoupon} from "../../src/pages/backOffice/backOfficeCodeCouponPage.tsx";

// Find the coupon and send back the discount value.
const handler: Handler = async (event) => {
    try {
        if (!process.env.MONGODB_DATABASE)
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_DATABASE not found');
        if (!process.env.MONGODB_COLLECTION_COUPONS)
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');

        const couponCode = event.queryStringParameters?.code;


        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const couponsCollection: Collection<ICoupon> = database.collection(process.env.MONGODB_COLLECTION_COUPONS as string);

        const coupon: WithId<ICoupon> | null = await couponsCollection.findOne({couponCode});
        if (coupon) {
            return {
                statusCode: 200,
                body: JSON.stringify(coupon.discount),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        } else {
            return generateResponse(404, 'Coupon not found');
        }


    } catch (error) {
        console.error('Error processing request:', error);
        return generateResponse(400, 'Invalid Request');
    }
}

export {handler};
