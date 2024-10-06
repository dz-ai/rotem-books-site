import React, {useEffect, useState} from "react";
import './backOfficePage.css'
import {BackOfficeOrderDetails} from "../../components/backOffice/backOfficeOrderDetails/backOfficeOrderDetails.tsx";
import {IBackofficeSideBar} from "../../components/backOffice/backOfficeSideBar.tsx";
import {ICartItem} from "../../context/cartContext.tsx";
import {useSearchParams} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {cloud, cricket, mouse} from "../../assets";


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

const orders: IOrder[] = [{
    id: '123',
    total: 20,
    payer: {
        name: 'david zim',
        phone: '3927549875',
        email: 'david@gmail.com',
        address: 'my address is so and so'
    },
    cart: [{
        id: '12334555999',
        title: 'some title',
        quantity: 1,
        price: 20,
        image: cloud
    }],
    status: EOrderStatus.new,
    date: 1728121042583
},
    {
        id: '3824768',
        total: 40,
        payer: {
            name: 'avi',
            phone: '498375',
            email: 'avi@gmail.com',
            address: 'my address is so and so'
        },
        cart: [
            {
                id: '495876',
                title: 'other title',
                quantity: 2,
                price: 20,
                image: cricket,
            },
            {
                id: '349587',
                title: 'ספר כלשהו',
                quantity: 3,
                price: 30,
                image: mouse,
            }
        ],
        status: EOrderStatus.new,
        date: 1728121174507,
    }
];

export const BackOfficePage: React.FC = () => {

    const isSmallScreen = useMediaQuery({query: '(max-width: 600px)'});

    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [openMobileSideBar, setOpenMobileSideBar] = useState(true);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

    const handleOrderClick = (order: IOrder) => {
        setCurrentOrder(order);
        setSearchParams(prev => {
            prev.set('orderId', order.id);
            return prev;
        });
    }

    useEffect(() => {
        if (orderId) {
            const orderToSet = orders.find(order => order.id === orderId);
            orderToSet &&
            setCurrentOrder(orderToSet);
            setOpenMobileSideBar(false);
        }
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
            </div>
        </div>
    );
}
