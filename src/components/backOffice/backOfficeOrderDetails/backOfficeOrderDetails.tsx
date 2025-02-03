import React, {useState} from "react";
import './backOfficeOrderDetails.css'
import {BackOfficeCartItem} from "../backOfficeCartItem.tsx";
import {IGetOrderResults} from "../../../../netlify/functions/get-order-details.mjs";
import {NavLink} from "react-router-dom";
import {translateOrderStatusUtil} from "../util/translateOrderStatusUtil.ts";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {ThreeDots} from "react-loader-spinner";
import {useGeneralStateContext} from "../../../context/generalStateContext.tsx";

interface IBackOfficeOrderDetailsProps {
    order: IGetOrderResults;
    isSmallScreen: boolean;
    setOpenOrderBar: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string } | null>>;
    closeOrder: (orderId: string) => Promise<null | number>;
}

export const BackOfficeOrderDetails: React.FC<IBackOfficeOrderDetailsProps> = ({
                                                                                   order,
                                                                                   isSmallScreen,
                                                                                   setOpenOrderBar,
                                                                                   closeOrder,
                                                                               }) => {

    const generalContext = useGeneralStateContext();

    const {client, income, url, amountLocal, documentDate} = order;
    const {name, address, city, zip, emails, phone} = client;

    const {status, color} = translateOrderStatusUtil(order.status, generalContext.language);
    const date: string[] = documentDate.split('-');

    const [loadingClose, setLoadingClose] = useState(false);

    return (
        <div className="back-office-order-details">
            {
                isSmallScreen &&
                <button className="reusable-control-btn" onClick={() => setOpenOrderBar(true)}>
                    <MdKeyboardDoubleArrowRight/>
                    {generalContext.t('backOfficeOrderDetails.order_list')}
                </button>
            }

            <div className="back-office-order-details-header horizontal-line">
                <h2>{name}</h2>
                <p className="back-office-order-details-header-date">{date[2]}/{date[1]}/{date[0]}</p>
                <p className={`${color} order-status`}>{status}</p>
            </div>

            <div className="back-office-order-details-client-details horizontal-line">
                <h3>{generalContext.t('backOfficeOrderDetails.client_details')}</h3>
                <p>{generalContext.t('backOfficeOrderDetails.address')}: {address} {city}</p>
                <p>{generalContext.t('backOfficeOrderDetails.zip')}: {zip}</p>
                <p>{generalContext.t('backOfficeOrderDetails.phone')}: {phone}</p>
                <p>{generalContext.t('backOfficeOrderDetails.email')}: {emails[0]}</p>
            </div>

            <div className="back-office-order-details-cart-details">
                <h2>{generalContext.t('backOfficeOrderDetails.purchase_details')}</h2>
                <ul>
                    {
                        income ?
                            income.map(cartItem =>
                                <BackOfficeCartItem key={cartItem.description} cartItem={cartItem}/>)
                            :
                            <p>{generalContext.t('backOfficeOrderDetails.missing_order_details')}</p>
                    }
                </ul>

                <p className="back-office-order-details-total">{generalContext.t('backOfficeOrderDetails.total_payment')}: {amountLocal}</p>
            </div>

            <div className={'back-office-order-details-receipt-close-order-bts'}>
                <NavLink to={url.origin}
                         className="reusable-control-btn">{generalContext.t('backOfficeOrderDetails.download_receipt')}</NavLink>
                {
                    order.status === 0 &&
                    <button
                        className="reusable-control-btn"
                        onClick={async () => {
                            if (order.status === 0) {
                                setLoadingClose(true);
                                order.status = await closeOrder(order.id) || order.status
                            }
                            setLoadingClose(false);
                        }}
                    >
                        {
                            loadingClose ?
                                <ThreeDots
                                    visible={true}
                                    height="35"
                                    width="35"
                                    color="#4fa94d"
                                    radius="9"
                                    ariaLabel="three-dots-loading"
                                />
                                :
                                !loadingClose &&
                                generalContext.t('backOfficeOrderDetails.archive_order')
                        }
                    </button>
                }
            </div>
        </div>
    );
}
