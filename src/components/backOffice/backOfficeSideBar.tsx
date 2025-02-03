import React, {useEffect, useState} from "react";
import {translateOrderStatusUtil} from "./util/translateOrderStatusUtil.ts";
import {ThreeDots} from "react-loader-spinner";
import {TOrderItem} from "../../../netlify/functions/get-orders.mjs";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

interface IBackofficeSideBarProps {
    isSmallScreen: boolean;
    orders: TOrderItem[];
    currentOrderId?: string;
    openMobileSideBar?: boolean;
    handleOrderClick: (orderId: string) => void;
    setOpenMobileSideBar?: React.Dispatch<React.SetStateAction<boolean>>;
    loadingOrders: boolean;
}

export const IBackofficeSideBar: React.FC<IBackofficeSideBarProps> = ({
                                                                          isSmallScreen,
                                                                          orders,
                                                                          currentOrderId,
                                                                          openMobileSideBar,
                                                                          handleOrderClick,
                                                                          setOpenMobileSideBar,
                                                                          loadingOrders,
                                                                      }) => {

    const generalContext = useGeneralStateContext();

    const [classname, setClassname] = useState<string>('back-office-sidebar-wrapper');

    const sideBarOpen = "bo-sidebar-mobile bo-sidebar-mobile-open";
    const sideBarClose = "bo-sidebar-mobile";

    // determine whether the class name is suited for wide screen or mobile
    useEffect(() => {

        // set mobile style if small screen
        if (isSmallScreen) {
            openMobileSideBar ? setClassname(sideBarOpen) : setClassname(sideBarClose);
        } else {
            setClassname('back-office-sidebar-wrapper');
        }

    }, [isSmallScreen, openMobileSideBar]);

    return (
        <div className={classname}>
            <div className={generalContext.language === 'he' ? "back-office-sidebar he" : "back-office-sidebar"}>
                <h3>{generalContext.t('backOfficePage.orders')}</h3>
                {
                    loadingOrders &&
                    <div className="orders-loading-wrapper">
                        <p>{generalContext.t('backOfficePage.ordersLoading')}</p>
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
                    !loadingOrders && orders.length > 0 &&
                    <ul>
                        {
                            orders.map(order => {
                                    const {status, color} = translateOrderStatusUtil(order.status, generalContext.language);
                                    const date: string[] = order.documentDate.split('-');

                                    return <li
                                        key={order.id}
                                        className={currentOrderId === order.id ? "back-office-sidebar-current-order" : ""}
                                        onClick={() => {
                                            handleOrderClick(order.id);
                                            setOpenMobileSideBar &&
                                            setOpenMobileSideBar(false);
                                        }}
                                    >
                                        <div className="back-office-sidebar-order-status">
                                            <p className={color}>{status}</p>
                                        </div>
                                        <p
                                            className="back-office-sidebar-client-name"
                                            title={order.client.name}
                                        >
                                            {order.client.name}
                                        </p>
                                        <p className="back-office-sidebar-date">{date[2]}/{date[1]}/{date[0]}</p>
                                    </li>
                                }
                            )
                        }
                    </ul>
                }
                {
                    !loadingOrders && orders.length === 0 &&
                    <p className="back-office-sidebar-message green">{generalContext.t('backOfficePage.noOrders')}</p>
                }
            </div>
        </div>
    );
}
