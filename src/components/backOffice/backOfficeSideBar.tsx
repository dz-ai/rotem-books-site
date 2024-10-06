import React, {useEffect, useState} from "react";
import {IOrder} from "../../pages/backOffice/backOfficePage.tsx";
import {orderDate} from "./getOrderDateUtil.tsx";

interface IBackofficeSideBarProps {
    orders: IOrder[];
    openMobileSideBar?: boolean;
    handleOrderClick: (order: IOrder) => void;
    setOpenMobileSideBar?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IBackofficeSideBar: React.FC<IBackofficeSideBarProps> = ({
                                                                          orders,
                                                                          openMobileSideBar,
                                                                          handleOrderClick,
                                                                          setOpenMobileSideBar
                                                                      }) => {

    const [classname, setClassname] = useState<string>('back-office-sidebar-wrapper');

    const sideBarOpen = "bo-sidebar-mobile bo-sidebar-mobile-open";
    const sideBarClose = "bo-sidebar-mobile";

    // determine if the class name is suited for wide screen or mobile
    useEffect(() => {

        // if "openMobileSideBar" is not undefined, it means that we are on mobile screen
        if (openMobileSideBar !== undefined) {
            openMobileSideBar ? setClassname(sideBarOpen) : setClassname(sideBarClose);
        } else {
            setClassname('back-office-sidebar-wrapper');
        }

    }, [openMobileSideBar]);

    return (
        <div className={classname}>
            <div className="back-office-sidebar">
                <h3>הזמנות</h3>
                <ul>
                    {
                        orders.map(order =>
                            <li
                                key={order.id}
                                onClick={() => {
                                    handleOrderClick(order);
                                    setOpenMobileSideBar &&
                                    setOpenMobileSideBar(false);
                                }}
                            >
                                <p className="back-office-sidebar-order-status">
                                    {order.status}
                                </p>
                                <p>
                                    {order.payer.name}
                                </p>

                                {orderDate(order.date)}
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
}
