import React, {useEffect, useRef, useState} from "react";
import './backOfficePage.css'
import {BackOfficeOrderDetails} from "../../components/backOffice/backOfficeOrderDetails/backOfficeOrderDetails.tsx";
import {useSearchParams} from "react-router-dom";
import {ThreeDots} from "react-loader-spinner";
import {IGetOrderResults} from "../../../netlify/functions/get-order-details.mjs";
import {TOrderItem} from "../../../netlify/functions/get-orders.mjs";
import {IBackofficeSideBar} from "../../components/backOffice/backOfficeSideBar.tsx";
import {useMediaQuery} from "react-responsive";
import {BackOfficeMessage} from "../../components/backOffice/util/backOfficeMessage.tsx";

const BackOfficePage: React.FC = () => {

    const isSmallScreen = useMediaQuery({query: '(max-width: 700px)'});

    const timOutRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [orders, setOrders] = useState<TOrderItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<IGetOrderResults | null>(null);
    const [openMobileSideBar, setOpenMobileSideBar] = useState(true);
    const [message, setMessage] = useState<{ message: string, color: string } | null>(null);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // fetch orders (name date and status) from MORNING API.
    const getOrders = async () => {
        try {
            setLoadingOrders(true);
            const getOrdersResponse = await fetch('/.netlify/functions/get-orders');

            setLoadingOrders(false);

            if (getOrdersResponse.status !== 200) {
                setMessage({message: 'משהו השתבש :(', color: 'red'});
                console.error(getOrdersResponse.status, 'get orders: something went wrong');
                return;
            }

            const getOrdersResults = await getOrdersResponse.json();
            setOrders(getOrdersResults);
            setMessage(null);

        } catch (err) {
            console.error(err);
            setLoadingOrders(false);
            setMessage({message: 'משהו השתבש :(', color: 'red'});
        }
    }

    // fetch the order details from "morning API" use of the order id.
    const getOrderDetails = async () => {

        if (currentOrder && currentOrder.id === orderId) {
            setOpenMobileSideBar(false);
            return
        }

        try {
            setCurrentOrder(null);
            setMessage(null);

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
                setMessage({message: 'משהו השתבש :( ניתן למצא את פרטי ההזמנה גם באתר ״חשבונית ירוקה״', color: 'red'});
                return null;
            }

            setCurrentOrder(getOrderResults);
            setOpenMobileSideBar(false);

        } catch (err) {
            console.error('something went wrong while fetch from get-order-details', err);
        }
    }

    // move order status to "closed" in MORNING-SYSTEM.
    const closeOrder = async (orderId: string): Promise<null | number> => {

        try {
            const protectedResponse = await fetch('/.netlify/functions/protected');
            if (protectedResponse.status !== 200) {
                setMessage({
                    message: 'משהו השתבש :( לא ניתן היה לסגור את ההזמנה, הפעולה ניתנת לביצוע גם ישירות באתר ״חשבונית ירוקה״',
                    color: 'red'
                });
                return null;
            }

            const closeOrderResponse = await fetch(`/.netlify/functions/close-order?orderId=${orderId}`);

            if (closeOrderResponse.status !== 200) {
                setMessage({
                    message: 'משהו השתבש :( לא ניתן היה לסגור את ההזמנה, הפעולה ניתנת לביצוע גם ישירות באתר ״חשבונית ירוקה״',
                    color: 'red'
                });
                return null;
            }

            setOrders(prevState => {
                prevState = prevState.map(order => {
                    if (order.id === orderId) {
                        order.status = 2; // 2 means - closed manually
                        setMessage({message: 'הפעולה בוצעה בהצלחה', color: 'green'});
                    }
                    return order;
                });
                return prevState;
            });

            return 2;

        } catch (err) {
            console.error(err);
            setMessage({message: 'משהו השתבש :(', color: 'red'});
            return null;
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

    // cleanup timeout
    useEffect(() => {
        return () => {
            timOutRef.current &&
            clearTimeout(timOutRef.current);
        }
    }, []);

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
                            closeOrder={closeOrder}
                            setMessage={setMessage}
                        />

                }
                {
                    message && !loadingOrders &&
                    <BackOfficeMessage
                        message={message}
                        setMessage={setMessage}
                        timeOutRef={timOutRef}
                    />
                }
            </div>
        </div>
    );
}

export default BackOfficePage;
