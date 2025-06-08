import {Collection} from "mongodb";
import {ICoupon} from "../../../src/pages/backOffice/backOfficeCodeCouponPage.tsx";

// delete the coupon and send back its id
export async function deleteCoupon(couponsCollection: Collection<ICoupon>, couponId: string):
    Promise<{ _id: string } | null> {
    const results = await couponsCollection.deleteOne({_id: couponId});

    if (results.deletedCount !== 0) {
        return {_id: couponId};
    } else {
        console.error('Error during Delete Coupon');
        return null;
    }
}
