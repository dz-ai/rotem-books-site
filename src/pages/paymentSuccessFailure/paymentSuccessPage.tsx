import './paymentSuccessFailurePage.css';
import React, {useEffect, useRef, useState} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {ColorRing} from 'react-loader-spinner'
import {LuDownload} from "react-icons/lu";

function PaymentSuccessPage() {
    const location = useLocation();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [requestId, setRequestId] = useState<string | null>(null);
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<boolean>(false);

    // fetch receipt url (that allow the user to download the receipt)
    const getReceipt = async (reqId: string): Promise<void> => {
        try {
            const getReceiptResponse = await fetch('/.netlify/functions/get-receipt', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqId),
            });

            const receiptRulAddress = await getReceiptResponse.json();

            if (receiptRulAddress) {
                setReceiptUrl(receiptRulAddress);

                // stop the interval from keep calling getReceipt() fn
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }

        } catch (error) {
            console.log(error);

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }

    // this effect uses setInterval to repeatedly call getReceipt() until a response with the receipt is received.
    // we use an interval because, at the time this page loads after a successful payment,
    // the payment information (including the receipt) is still being processed and may not yet be available in the database.
    useEffect(() => {
        if (!receiptUrl) {

            // get the request id from the url (passed from the clearing terminal after a successful payment)
            const params: URLSearchParams = new URLSearchParams(location.search);
            const requestIdParam: string | null = params.get('requestId');

            if (requestIdParam) {

                setRequestId(requestIdParam);

                intervalRef.current = setInterval(() => {
                    getReceipt(requestIdParam).then();
                }, 800);
            }

        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [receiptUrl]);

    // this effect clears the interval that calls the getReceipt function after 20 seconds, stopping further attempts to fetch the receipt.
    // instead, it displays a message instructing the user to check their email for the receipt.
    useEffect(() => {

        timeoutRef.current = setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            !receiptUrl &&
            setMessage(true);

        }, 60 * 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [receiptUrl]);

    return (
        <div className="success-failure-page">
            <h2>ההזמנה הושלמה בהצלחה</h2>
            <p>מס׳ ההזמנה: {requestId}</p>
            {
                receiptUrl &&
                <NavLink className="reusable-control-btn" to={receiptUrl}>
                    להורדת הקבלה
                    <LuDownload/>
                </NavLink>
            }
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
