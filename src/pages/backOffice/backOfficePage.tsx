import React, {useEffect, useState} from "react";
import './backOfficePage.css'
import {BackOfficeOrderDetails} from "../../components/backOffice/backOfficeOrderDetails/backOfficeOrderDetails.tsx";
import {IBackofficeSideBar} from "../../components/backOffice/backOfficeSideBar.tsx";
import {ICartItem} from "../../context/cartContext.tsx";
import {useSearchParams} from "react-router-dom";
import {useMediaQuery} from "react-responsive";


interface IPayer {
    name: string;
    phone: string;
    email: string;
    address: string;
}

enum EOrderStatus {new = 'new', open = 'open', close = 'close'}

export interface IOrder {
    id: string;
    total: number;
    payer: IPayer;
    cart: ICartItem[];
    status: EOrderStatus;
    date: number;
}

export const BackOfficePage: React.FC = () => {

    const isSmallScreen = useMediaQuery({query: '(max-width: 600px)'});

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [openMobileSideBar, setOpenMobileSideBar] = useState(true);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // get the orders from Database
    const getOrders = async (): Promise<IOrder[] | null> => {

        try {

            const ordersResponse = await fetch('.netlify/functions/get-orders');

            const orders = await ordersResponse.json();

            if (orders) {
                return orders;
            } else {
                return null;
            }

        } catch (err) {
            console.error(err);
            return null;
        }
    }

    const handleOrderClick = (order: IOrder) => {
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
                    orderToSet &&
                    setCurrentOrder(orderToSet);

                    setOpenMobileSideBar(false);

                    // set the orders to display on the sidebar
                } else if (resultOrders && !orderId) {
                    setOrders(resultOrders);
                } else {
                    setOpenMobileSideBar(false);
                    setMessage('משהו השתבש :(');
                }
            });
    }, [orderId]);

    return (
        <div className="back-office-page">

            {
                isSmallScreen &&
                <IBackofficeSideBar
                    orders={orders}
                    openMobileSideBar={openMobileSideBar}
                    handleOrderClick={handleOrderClick}
                    setOpenMobileSideBar={setOpenMobileSideBar}
                />
            }
            {
                !isSmallScreen &&

                <IBackofficeSideBar
                    orders={orders}
                    handleOrderClick={handleOrderClick}
                />
            }

            <div className="back-office-order-details-wrapper">
                {
                    currentOrder &&
                    <BackOfficeOrderDetails order={currentOrder} setOpenOrderBar={setOpenMobileSideBar}/>
                }
                {
                    message &&
                    <p className="back-office-page-message">{message}</p>
                }
            </div>
        </div>
    );
}
