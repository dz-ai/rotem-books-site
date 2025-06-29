import React, {useEffect, useState} from "react";
import "./backOfficeCodeCouponPage.css"
import {BackOfficeCoupon} from "../../components/backOffice/backOfficeCoupon/backOfficeCoupon.tsx";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import {useUserConfirmation} from "../../hooks/useUserConfirmation.ts";
import {ThreeDots} from "react-loader-spinner";
import {Helmet} from "react-helmet";

export interface ICoupon {
    _id: string;
    couponName: string;
    couponCode: string;
    discount: string;
    createdAt: Date;
}

const BackOfficeCodeCouponPage = () => {
    const generalContext = useGeneralStateContext();

    const {isVisible, requestConfirmation, handleUserResponse} = useUserConfirmation();

    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [inEdit, setInEdit] = useState<null | string>(null); /* get the coupon id as a string to make unique identifier to the currently edited coupon */
    const [message, setMessage] = useState<{ text: string, color: 'red' | 'green' } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Add new Coupon with empty fields and set the status to "in Edit"
    const addNewCoupon = (): void => {
        setMessage(null);
        const id: string = crypto.randomUUID();
        setCoupons((prevState: ICoupon[]) => {
            return [{_id: id, couponName: '', couponCode: '', discount: '0', createdAt: new Date()}, ...prevState];
        });
        setInEdit(id);
    }

    // save a new coupon or new state of coupon or delete the coupon in the Database and update the UI.
    const editCoupons = async (couponId: string, action: 'save' | 'delete', payload: ICoupon): Promise<void> => {

        if (action === 'save' && payload) {
            const savedCoupon: ICoupon | null = await saveCoupon(couponId, action, payload);
            if (!savedCoupon) {
                // the Objects reference must be changed to trigger rerender and set the values of the old coupons list.
                setCoupons([...coupons.map(coupon => ({...coupon}))]);
                setMessage({text: generalContext.t('backOfficeCoupons.errorMessage'), color: 'red'});
                return;
            }
            const couponToEditIndex = coupons.findIndex((coupon: ICoupon) => savedCoupon._id === coupon._id);
            coupons[couponToEditIndex] = savedCoupon;
            setCoupons([...coupons]);
            setMessage({text: generalContext.t('backOfficeCoupons.saveMessage'), color: 'green'});
        }

        if (action === 'delete') {
            if (payload.couponName === '' || payload.couponCode === '' || payload.discount === '') {
                const newCouponsArr: ICoupon[] = [];
                coupons.forEach((coupon: ICoupon) => coupon._id !== payload._id && newCouponsArr.push(coupon));
                setCoupons(newCouponsArr);
                return;
            }

            // await to the user's delete confirmation
            const usersReaction: boolean = await requestConfirmation();
            if (!usersReaction) return;

            const deletedCoupon: ICoupon | null = await saveCoupon(couponId, action, payload);
            if (!deletedCoupon) {
                setMessage({text: generalContext.t('backOfficeCoupons.errorMessage'), color: 'red'});
                return;
            }
            setCoupons(prevState => {
                const couponsNewArray: ICoupon[] = [];
                prevState.forEach((coupon: ICoupon) => {
                    coupon._id !== deletedCoupon._id && couponsNewArray.push(coupon);
                })
                return couponsNewArray;
            });
        }
    }

    // send save or delete coupon request to the server (Netlify Handler)
    async function saveCoupon(_id: string, action: 'save' | 'delete', couponData?: ICoupon): Promise<ICoupon | null> {
        try {
            const couponsResponse = await fetch('.netlify/functions/coupons', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({_id, couponData, action}),
            });

            if (couponsResponse.ok) {
                return await couponsResponse.json();
            } else {
                console.error(`Response is ${couponsResponse.status}`);
                return null;
            }
        } catch (err) {
            console.log(err);
            return null
        }
    }

    // fetch all the coupons from the Database
    async function getAllCoupons(): Promise<void> {
        try {
            const couponsResponse = await fetch('.netlify/functions/get-all-coupons', {
                method: 'get',
            });

            if (couponsResponse.ok) {
                const couponsResults: ICoupon[] = await couponsResponse.json();
                typeof couponsResults === 'object' && setCoupons(couponsResults);
            } else {
                console.error(`Response is ${couponsResponse.status}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllCoupons()
            .then(() => setLoading(false));
    }, []);

    return (
        <div className="back-office-coupon-page">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <section className="add-new-coupon-btn-section">
                <div className="add-new-coupon-btn-wrapper">
                    <button
                        className="coupon-btn new-coupon-btn"
                        onClick={addNewCoupon}
                        disabled={inEdit !== null}>
                        +
                    </button>
                    <p>{generalContext.t('backOfficeCoupons.newCouponBtn')}</p>
                </div>
                {
                    message &&
                    <p className={message.color}>{message.text}</p>
                }
            </section>
            <ul className="coupon-list" onClick={() => setMessage(null)}>
                {
                    coupons.length > 0 &&
                    coupons.map((coupon: ICoupon) =>
                        <BackOfficeCoupon
                            key={coupon._id}
                            coupon={coupon}
                            couponId={coupon._id}
                            couponName={coupon.couponName}
                            couponCode={coupon.couponCode}
                            discount={coupon.discount}
                            inEdit={inEdit}
                            editCoupons={editCoupons}
                            setInEdit={setInEdit}
                        />)
                }
                {
                    loading &&
                    <div className="loader">
                        <ThreeDots
                            visible={true}
                            height="35"
                            width="35"
                            color="#008000ab"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                    </div>
                }
                {
                    coupons.length === 0 && !loading &&
                    <p className="no-coupons-to-display">{generalContext.t('backOfficeCoupons.noCouponsToShow')}</p>
                }
            </ul>
            {
                isVisible &&
                <div className="delete-coupon-popup-wrapper">
                    <div className="delete-coupon-popup">
                        <p>{generalContext.t('backOfficeCoupons.deleteCouponQuestion')}</p>
                        <section>
                            <button className="coupon-btn delete-btn" onClick={() => handleUserResponse(true)}>
                                {generalContext.t('backOfficeCoupons.deleteCoupon')}
                            </button>
                            <button className="coupon-btn" onClick={() => handleUserResponse(false)}>
                                {generalContext.t('shared.close')}
                            </button>
                        </section>
                    </div>
                </div>
            }
        </div>
    );
};

export default BackOfficeCodeCouponPage;
