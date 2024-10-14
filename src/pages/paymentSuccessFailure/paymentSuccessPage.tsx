import './paymentSuccessFailurePage.css';
import React, {useEffect, useRef, useState} from "react";
import {NavLink, useSearchParams} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";
import {ISendMailEventBody} from "../../../netlify/functions/send-email.mjs";
import {ColorRing} from 'react-loader-spinner'
import {LuDownload} from "react-icons/lu";
import {MdOutlineMarkEmailRead} from "react-icons/md";

function PaymentSuccessPage() {

    const cartContext = useCart();

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('requestId');

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [receiptId, setReceiptId] = useState<string | null>(null);
    const [message, setMessage] = useState<boolean>(false);

    // fetch receipt url (that allow the user to download the receipt)
    const getReceipt = async (): Promise<void> => {
        try {
            const getReceiptResponse = await fetch('/.netlify/functions/get-receipt', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderId),
            });

            const getReceiptResult = await getReceiptResponse.json();

            // prevent "destruction of null Error"
            if (!getReceiptResult) return;

            const {receiptUrl, receiptId} = getReceiptResult;

            setReceiptId(receiptId);

            if (receiptUrl) {
                setReceiptUrl(receiptUrl);

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
    const updateOrderDetails = async (requestId: string, receiptId: string) => {

        try {
            const updateOrderResponse = await fetch('/.netlify/functions/add-missing-details-to-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({requestId, receiptId}),
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

            if (orderId) {

                intervalRef.current = setInterval(() => {
                    getReceipt().then().catch(console.log);
                }, 800);
            }

        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [receiptUrl]);

    // this effect clears the interval that calls the getReceipt function after 60 seconds,
    // stopping further attempts to fetch the receipt.
    // instead, it displays a message instructing the user to check their email for the receipt.
    useEffect(() => {

        timeoutRef.current = setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // update the Database even if we are missing the receipt url
            if (!receiptUrl && orderId) {
                updateOrderDetails(orderId, '')
                    .then(() => cartContext.cleanCartCookie())
                    .catch(console.log);
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

        if (orderId) {
            triggerSendNotificationMail(orderId).then(console.log).catch(console.log);
        } else {
            console.error('requestId from url Params is missing')
        }

    }, []);

    useEffect(() => {
        if (!orderId) {
            console.error('requestId from url Params is missing');
        }

        if (orderId && receiptId) {
            updateOrderDetails(orderId, receiptId)
                .then(() => {
                    cartContext.cleanCartCookie();
                })
                .catch(console.log);
        }
    }, [receiptId !== null]);

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
