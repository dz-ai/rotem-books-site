import './paymentSuccessFailurePage.css';
import React, {useEffect, useRef, useState} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {ColorRing} from 'react-loader-spinner'
import {LuDownload} from "react-icons/lu";
import {ISendMailEventBody} from "../../../netlify/functions/send-email.mjs";
import {useCart} from "../../context/cartContext.tsx";

// TODO test on a mobile screen
function PaymentSuccessPage() {

    const cartContext = useCart();

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

    // trigger notification email to the website owner about the new order
    const triggerSendNotificationMail = async (requestId: string) => {

        if (!requestId) {
            new Error('request id is missing');
            return;
        }

        const sendEmailBody: ISendMailEventBody = {
            subject: 'הזמנה חדשה!',
            parameters: {
                url: 'the url will be added at the server form .env',
                requestId: requestId,
            },
        }

        try {

            const sendMailResponse = await fetch('/.netlify/functions/send-email', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendEmailBody),
            });

            const sendEmailResults = await sendMailResponse.json();

            if (!sendEmailResults) {
                return new Error('Something went wrong during sending Email process');
            } else {
                return 'Email sent successfully';
            }

        } catch (err) {
            return err;
        }
    }

    // send the cart and client address via a cookie and update the order in the database
    // using its ID, which is equal to the request ID
    const updateOrderDetails = async (requestId: string) => {

        try {
            const updateOrderResponse = await fetch('/.netlify/functions/add-missing-details-to-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestId),
            });

            return await updateOrderResponse.json();

        } catch (err) {
            return err;
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

    // trigger Email sending and order details updating
    useEffect(() => {

        // get the request id from the url (passed from the clearing terminal after a successful payment)
        const params: URLSearchParams = new URLSearchParams(location.search);
        const requestIdParam: string | null = params.get('requestId');

        if (requestIdParam) {
            triggerSendNotificationMail(requestIdParam).then(console.log);
            updateOrderDetails(requestIdParam).then(() => {
                cartContext.cleanCartCookie();
            });
        } else {
            console.error('requestId from url Params is missing')
        }

    }, []);

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
