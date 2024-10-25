import './paymentSuccessFailurePage.css';
import React, {useEffect, useState} from "react";
import {NavLink, useSearchParams} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";
import {ColorRing} from 'react-loader-spinner'
import {LuDownload} from "react-icons/lu";
import {MdOutlineMarkEmailRead} from "react-icons/md";

function PaymentSuccessPage() {

    const cartContext = useCart();

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('requestId');

    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<boolean>(false);

    const afterPaymentSuccess = async () => {
        try {

            const response = await fetch('/.netlify/functions/after-payment-success');

            const results: { receiptUrl: string, emailSandingResult: boolean } = await response.json();

            if (results.receiptUrl) {
                setReceiptUrl(results.receiptUrl);
            } else {
                setMessage(true)
            }

            if (!results.emailSandingResult) console.error('Email not sent');

        } catch (err) {
            console.error(err);
            setMessage(true);
        }

    }

    useEffect(() => {
        cartContext.cleanCartCookie();
        afterPaymentSuccess().then();
    }, []);

    return (
        <div className="success-failure-page">
            <h2>ההזמנה הושלמה בהצלחה</h2>
            <p className="order-id">מס׳ ההזמנה: {orderId}</p>
            {
                receiptUrl &&
                <NavLink className="reusable-control-btn" to={receiptUrl}>
                    להורדת הקבלה
                    <LuDownload/>
                </NavLink>
            }
            <p className="receipt-in-email-message">
                ניתן למצוא את הקבלה גם במייל
                <MdOutlineMarkEmailRead/>
            </p>
            {
                !receiptUrl && !message &&
                <>
                    <p className="loading-text">הקבלה בטעינה</p>
                    <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
                </>
            }
            {
                message &&
                <p className="something-went-wrong-text">משהו השתבש במהלך הבאת הקבלה אנא בדוק הימצאות הקבלה במייל</p>
            }
        </div>
    );
}

export default PaymentSuccessPage;
