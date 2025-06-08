import {Collection, UpdateResult, WithId} from "mongodb";
import {ICoupon} from "../../../src/pages/backOffice/backOfficeCodeCouponPage.tsx";

export async function insertNewCoupon(couponsCollection: Collection<ICoupon>, couponsData: ICoupon):
    Promise<WithId<ICoupon> | UpdateResult<ICoupon> | null> {

    await couponsCollection.updateOne(
        {_id: couponsData._id},
        {$set: couponsData},
        {upsert: true}, /* telling mongo to insert a new Object in the Database if is not already exist */
    );

    const updatedCoupon: WithId<ICoupon> | null = await couponsCollection.findOne({_id: couponsData._id});
    if (updatedCoupon) return updatedCoupon;
    else throw new Error('Error in Coupon-Update');
}
