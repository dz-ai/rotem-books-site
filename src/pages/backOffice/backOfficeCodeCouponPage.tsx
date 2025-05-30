import "./backOfficeCodeCouponPage.css"
import {BackOfficeCoupon} from "../../components/backOffice/backOfficeCoupon/backOfficeCoupon.tsx";
import {useState} from "react";

export interface ICoupon {
    couponId: string;
    couponName: string;
    couponCode: string;
    discount: string;
}

export const mockArray: ICoupon[] = [
    {
        couponId: "qwdhwjkh11123",
        couponName: "קופון",
        couponCode: "123",
        discount: "10"
    }
];

export const BackOfficeCodeCouponPage = () => {

    const [coupons, setCoupons] = useState<ICoupon[]>(mockArray);
    const [inEdit, setInEdit] = useState<null | string>(null); /* get the coupon id as a string to make unique identifier to the currently edited coupon */

    // Add new Coupon with empty fields and set the status to "in Edit"
    const addNewCoupon = (): void => {
        const id: string = crypto.randomUUID();
        setCoupons((prevState: ICoupon[]) => {
            return [{couponId: id, couponName: '', couponCode: '', discount: '0'}, ...prevState];
        });
        setInEdit(id);
    }

    // save a new state of coupon or delete the coupon
    const editCoupons = (couponId: string, action: 'save' | 'delete', payload?: ICoupon): void => {

        setCoupons(prevState => {
            // prepared Array to push in it
            const newCouponsState: ICoupon[] = [];

            prevState.forEach((coupon: ICoupon) => {
                if (couponId !== coupon.couponId) { /* if not the edited one push it as it is */
                    newCouponsState.push(coupon);
                } else if (couponId === coupon.couponId && action === 'save' && payload) { /* if it is the edited one and should be saved, push the payload instead of the original coupon */
                    newCouponsState.push(payload);
                }
                // if it is: couponId === coupon.couponId && action === 'delete'. it will not be pushed
                // and therefore will not be included in the new coupons Array
            });

            return newCouponsState;
        });
    }

    return (
        <div className="back-office-coupon-page">
            <div className="add-new-coupon-btn-wrapper">
                <button
                    className="coupon-btn new-coupon-btn"
                    onClick={addNewCoupon}
                    disabled={inEdit !== null}>
                    +
                </button>
                <p>הוסף קופון חדש</p>
            </div>
            <ul className="coupon-list">
                {
                    coupons.map((coupon: ICoupon) =>
                        <BackOfficeCoupon
                            key={coupon.couponId}
                            couponId={coupon.couponId}
                            couponName={coupon.couponName}
                            couponCode={coupon.couponCode}
                            discount={coupon.discount}
                            inEdit={inEdit}
                            editCoupons={editCoupons}
                            setInEdit={setInEdit}
                        />)
                }
            </ul>
        </div>
    );
};
