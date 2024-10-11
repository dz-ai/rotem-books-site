import React, {useEffect, useState} from "react";
import {IOrder} from "../../pages/backOffice/backOfficePage.tsx";
import {orderDate} from "./util/getOrderDateUtil.tsx";
import {translateOrderStatusUtil} from "./util/translateOrderStatusUtil.ts";
import {ThreeDots} from "react-loader-spinner";

interface IBackofficeSideBarProps {
    orders: IOrder[];
    currentOrderId?: string;
    openMobileSideBar?: boolean;
    handleOrderClick: (order: IOrder) => void;
    setOpenMobileSideBar?: React.Dispatch<React.SetStateAction<boolean>>;
    loadingStatus: false | string;
    loadingOrders: boolean;
}

export const IBackofficeSideBar: React.FC<IBackofficeSideBarProps> = ({
                                                                          orders,
                                                                          currentOrderId,
                                                                          openMobileSideBar,
                                                                          handleOrderClick,
                                                                          setOpenMobileSideBar,
                                                                          loadingStatus,
                                                                          loadingOrders
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
                {
                    loadingOrders &&
                    <div className="orders-loading-wrapper">
                        <p>הזמנות בטעינה</p>
                        <ThreeDots
                            visible={true}
                            height="35"
                            width="35"
                            color="#008000ab"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                    </div>
                }
                {
                    !loadingOrders &&
                    <ul>
                        {
                            orders.map(order => {
                                    const {status, color} = translateOrderStatusUtil(order.status);
                                    return <li
                                        key={order.id}
                                        className={currentOrderId === order.id ? "back-office-sidebar-current-order" : ""}
                                        onClick={() => {
                                            handleOrderClick(order);
                                            setOpenMobileSideBar &&
                                            setOpenMobileSideBar(false);
                                        }}
                                    >

                                        <div className="back-office-sidebar-order-status">
                                            {
                                                loadingStatus && loadingStatus === order.id ?
                                                    <ThreeDots
                                                        visible={true}
                                                        height="18"
                                                        width="18"
                                                        color="#008000ab"
                                                        radius="9"
                                                        ariaLabel="three-dots-loading"
                                                    />
                                                    :
                                                    <p className={color}>
                                                        {status}
                                                    </p>
                                            }
                                        </div>
                                        <p className="back-office-sidebar-client-name">
                                            {order.payer.name}
                                        </p>

                                        {orderDate(order.date)}
                                    </li>
                                }
                            )
                        }
                    </ul>
                }
            </div>
        </div>
    );
}
