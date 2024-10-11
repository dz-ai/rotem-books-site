import React, {useEffect, useState} from "react";
import './backOfficePage.css'
import {BackOfficeOrderDetails} from "../../components/backOffice/backOfficeOrderDetails/backOfficeOrderDetails.tsx";
import {IBackofficeSideBar} from "../../components/backOffice/backOfficeSideBar.tsx";
import {ICartItem} from "../../context/cartContext.tsx";
import {useSearchParams} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {sortOrdersUtil} from "../../components/backOffice/util/sortOrdersUtil.ts";
import {ThreeDots} from "react-loader-spinner";


interface IPayer {
    name: string;
    phone: string;
    email: string;
    address: string;
}

export enum EOrderStatus {new = 'new', open = 'open', close = 'close'}

export interface IOrder {
    id: string;
    receiptId: string;
    total: number;
    payer: IPayer;
    cart: ICartItem[];
    status: EOrderStatus;
    date: number;
}

export const BackOfficePage: React.FC = () => {

    const isSmallScreen = useMediaQuery({query: '(max-width: 700px)'});

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [openMobileSideBar, setOpenMobileSideBar] = useState(true);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loadingStatus, setLoadingStatus] = useState<false | string>(false);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // get the orders from Database
    const getOrders = async (): Promise<IOrder[] | null> => {

        try {
            setLoadingOrders(true);

            const ordersResponse = await fetch('.netlify/functions/get-orders');

            const orders = await ordersResponse.json();

            setLoadingOrders(false);

            if (orders) {
                return sortOrdersUtil(orders);
            } else {
                return null;
            }

        } catch (err) {
            setLoadingOrders(false);
            console.error(err);
            return null;
        }
    }

    // update the order status "new" "open" "close" receipt id may be used for close or open order on "Morning" api
    const updateOrderStatus = async (order: IOrder, status: EOrderStatus, receiptId?: string) => {

        try {
            // trigger loader only to the line of the specific order
            setLoadingStatus(order.id);

            const updateStatusResponse = await fetch('.netlify/functions/update-order-status', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({reqId: order.id, receiptId: receiptId || null, status}),
            });

            const {newStatus} = await updateStatusResponse.json();

            if (newStatus) {
                order.status = newStatus;
            }

            setLoadingStatus(false);
            sortOrdersUtil(orders);

            return order;

        } catch (err) {
            setLoadingStatus(false);
            console.error(err);
        }

    }

    // handle the user's choice as the user clicks on order in the sidebar
    const handleOrderClick = async (order: IOrder) => {

        // set the order status to "open" when the user accesses a new order for the first time.
        if (order.status === EOrderStatus.new) {
            setCurrentOrder(null); // clear the "order-details" window and display the loader instead
            await updateOrderStatus(order, EOrderStatus.open);
        }

        setCurrentOrder(order);
        setSearchParams(prev => {
            prev.set('orderId', order.id);
            return prev;
        });
    }

    // get the orders as the page is loading
    useEffect(() => {
        getOrders()
            .then(resultOrders => {
                // set to specific order if there is an order ID
                if (resultOrders && orderId) {
                    setOrders(resultOrders);

                    const orderToSet = resultOrders.find(order => order.id === orderId);
                    if (orderToSet) {

                        // set the order status to "open" when the user accesses a new order for the first time.
                        orderToSet.status === EOrderStatus.new ?

                            updateOrderStatus(orderToSet, EOrderStatus.open)
                                .then(updatedOrder => {
                                    updatedOrder &&
                                    setCurrentOrder(updatedOrder);
                                })
                            :
                            setCurrentOrder(orderToSet);
                    }

                    setOpenMobileSideBar(false);

                    // set the orders to display on the sidebar
                } else if (resultOrders && !orderId) {
                    setOrders(resultOrders);
                } else {
                    setOpenMobileSideBar(false);
                    setMessage('משהו השתבש :(');
                }
            });
    }, []);

    return (
        <div className="back-office-page">

            {
                isSmallScreen &&
                <IBackofficeSideBar
                    orders={orders}
                    currentOrderId={currentOrder?.id}
                    openMobileSideBar={openMobileSideBar}
                    handleOrderClick={handleOrderClick}
                    setOpenMobileSideBar={setOpenMobileSideBar}
                    loadingStatus={loadingStatus}
                    loadingOrders={loadingOrders}
                />
            }
            {
                !isSmallScreen &&

                <IBackofficeSideBar
                    orders={orders}
                    currentOrderId={currentOrder?.id}
                    handleOrderClick={handleOrderClick}
                    loadingStatus={loadingStatus}
                    loadingOrders={loadingOrders}
                />
            }

            <div className="back-office-order-details-wrapper">
                {
                    !currentOrder && orderId ?
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
                            updateOrderStatus={updateOrderStatus}
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
