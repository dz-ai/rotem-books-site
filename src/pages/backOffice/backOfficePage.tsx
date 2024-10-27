import React, {useEffect, useState} from "react";
import './backOfficePage.css'
import {BackOfficeOrderDetails} from "../../components/backOffice/backOfficeOrderDetails/backOfficeOrderDetails.tsx";
import {ICartItem} from "../../context/cartContext.tsx";
import {useSearchParams} from "react-router-dom";
import {ThreeDots} from "react-loader-spinner";
import {IGetOrderResults} from "../../../netlify/functions/get-order-details.mjs";


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

    // const isSmallScreen = useMediaQuery({query: '(max-width: 700px)'});

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    // const [openMobileSideBar, setOpenMobileSideBar] = useState(true);
    const [currentOrder, setCurrentOrder] = useState<IGetOrderResults | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // fetch the order details from "morning API" use of the order id.
    const getOrderDetails = async () => {
        try {
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
        getOrderDetails().then();
    }, [orderId]);

    return (
        <div className="back-office-page">

            {
                // isSmallScreen &&
                // <IBackofficeSideBar
                //     orders={orders}
                //     currentOrderId={currentOrder?.id}
                //     openMobileSideBar={openMobileSideBar}
                //     handleOrderClick={handleOrderClick}
                //     setOpenMobileSideBar={setOpenMobileSideBar}
                //     loadingStatus={loadingStatus}
                //     loadingOrders={loadingOrders}
                // />
            }
            {
                // !isSmallScreen &&
                // <IBackofficeSideBar
                //     orders={orders}
                //     currentOrderId={currentOrder?.id}
                //     handleOrderClick={handleOrderClick}
                //     loadingStatus={loadingStatus}
                //     loadingOrders={loadingOrders}
                // />
            }

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
                        <BackOfficeOrderDetails order={currentOrder}/>

                }
                {
                    message &&
                    <p className="back-office-page-message">{message}</p>
                }
            </div>
        </div>
    );
}
