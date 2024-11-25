import React, {useEffect, useState} from "react";
import './backOfficePage.css'
import {BackOfficeOrderDetails} from "../../components/backOffice/backOfficeOrderDetails/backOfficeOrderDetails.tsx";
import {useSearchParams} from "react-router-dom";
import {ThreeDots} from "react-loader-spinner";
import {IGetOrderResults} from "../../../netlify/functions/get-order-details.mjs";
import {TOrderItem} from "../../../netlify/functions/get-orders.mjs";
import {IBackofficeSideBar} from "../../components/backOffice/backOfficeSideBar.tsx";
import {useMediaQuery} from "react-responsive";

const BackOfficePage: React.FC = () => {

    const isSmallScreen = useMediaQuery({query: '(max-width: 700px)'});

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [openMobileSideBar, setOpenMobileSideBar] = useState(true);
    const [currentOrder, setCurrentOrder] = useState<IGetOrderResults | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [orders, setOrders] = useState<TOrderItem[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // fetch orders (name date and status) from MORNING API.
    const getOrders = async () => {
        try {
            setLoadingOrders(true);
            const getOrdersResponse = await fetch('/.netlify/functions/get-orders');

            setLoadingOrders(false);

            if (getOrdersResponse.status !== 200) {
                setMessage('משהו השתבש :(');
                console.error(getOrdersResponse.status, 'get orders: something went wrong');
                return;
            }

            const getOrdersResults = await getOrdersResponse.json();
            setOrders(getOrdersResults);

        } catch (err) {
            console.error(err);
            setLoadingOrders(false);
            setMessage('משהו השתבש');
        }
    }

    // fetch the order details from "morning API" use of the order id.
    const getOrderDetails = async () => {
        try {
            setCurrentOrder(null);
            const getOrderResponse = await fetch('/.netlify/functions/get-order-details', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderId),
            });

            const getOrderResults = await getOrderResponse.json();

            if (getOrderResponse.status !== 200) {
                console.error(getOrderResponse.status, 'something went wrong while fetch from get-order-details', getOrderResults);
                setMessage('משהו השתבש :( ניתן למצא את פרטי ההזמנה גם באתר ״חשבונית ירוקה״');
                return null;
            }

            setCurrentOrder(getOrderResults);

        } catch (err) {
            console.error('something went wrong while fetch from get-order-details', err);
        }
    }

    useEffect(() => {
        if (orderId) {
            getOrderDetails().then();
        }
        if (orders.length === 0) {
            getOrders().then();
        }

    }, [orderId]);

    return (
        <div className="back-office-page">

            <IBackofficeSideBar
                isSmallScreen={isSmallScreen}
                orders={orders}
                currentOrderId={currentOrder?.id}
                openMobileSideBar={openMobileSideBar}
                handleOrderClick={(id) => setSearchParams({orderId: id})}
                setOpenMobileSideBar={setOpenMobileSideBar}
                loadingOrders={loadingOrders}
                message={message}
            />

            <div className="back-office-order-details-wrapper">
                {
                    !currentOrder && orderId && !message ?
                        <ThreeDots
                            visible={true}
                            height="70"
                            width="70"
                            color="#4fa94d"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                        :
                        currentOrder &&
                        <BackOfficeOrderDetails
                            order={currentOrder}
                            setOpenOrderBar={setOpenMobileSideBar}
                            isSmallScreen={isSmallScreen}
                        />

                }
                {
                    message &&
                    <p className="back-office-page-message">{message}</p>
                }
            </div>
        </div>
    );
}

export default BackOfficePage;
