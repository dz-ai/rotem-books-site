import {Handler} from '@netlify/functions';
import {mongoClientPromise} from "../../../netlify-functions-util/mongoDB-connection.ts";
import {Collection, UpdateResult, WithId} from "mongodb";
import {generateResponse} from "../../../netlify-functions-util/validateRequest.ts";
import {insertNewCoupon} from "./insert-new-coupon.ts";
import {ICoupon} from "../../../src/pages/backOffice/backOfficeCodeCouponPage.tsx";
import {deleteCoupon} from "./delete-coupon.ts";

// Save new or updated coupons or delete them according to the action type that sent with the request
const handler: Handler = async (event) => {
    try {
        if (!event.body)
            return generateResponse(400, 'BED REQUEST - coupons data is missing');

        if (!process.env.MONGODB_DATABASE)
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_DATABASE not found');

        if (!process.env.MONGODB_COLLECTION_COUPONS)
            return generateResponse(500, 'Server configuration error, env variable - MONGODB_COLLECTION_ORDERS not found');

        const couponsData = JSON.parse(event.body);

        const database = (await mongoClientPromise).db(process.env.MONGODB_DATABASE);
        const couponsCollection: Collection<ICoupon> = database.collection(process.env.MONGODB_COLLECTION_COUPONS as string);

        let savedCoupon: WithId<ICoupon> | UpdateResult<ICoupon> | { _id: string } | null = null;

        if (couponsData.action === 'save') {
            savedCoupon = await insertNewCoupon(couponsCollection, couponsData.couponData);
        }

        if (couponsData.action === 'delete') {
            savedCoupon = await deleteCoupon(couponsCollection, couponsData._id);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(savedCoupon),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return generateResponse(400, 'Invalid Request');
    }
}

export {handler};
