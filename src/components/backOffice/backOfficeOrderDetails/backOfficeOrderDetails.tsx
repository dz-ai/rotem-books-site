import React from "react";
import './backOfficeOrderDetails.css'
import {BackOfficeCartItem} from "../backOfficeCartItem.tsx";
import {IGetOrderResults} from "../../../../netlify/functions/get-order-details.mjs";
import {NavLink} from "react-router-dom";

interface IBackOfficeOrderDetailsProps {
    order: IGetOrderResults;
}

export const BackOfficeOrderDetails: React.FC<IBackOfficeOrderDetailsProps> = ({order}) => {

    const {client, income, url, amountLocal, documentDate} = order;
    const {name, address, city, zip, emails, phone} = client;

    // const {status, color} = translateOrderStatusUtil(order.status);
    const date = documentDate.split('-');

    return (
        <div className="back-office-order-details">
            {/*<button className="reusable-control-btn back-to-order-list" onClick={() => setOpenOrderBar(true)}>*/}
            {/*    <MdKeyboardDoubleArrowRight/>*/}
            {/*    לרשימת ההזמנות*/}
            {/*</button>*/}

            <div className="back-office-order-details-header horizontal-line">
                <h2>{name}</h2>
                <p className="back-office-order-details-header-date">{date[2]}/{date[1]}/{date[0]}</p>
            </div>

            <div className="back-office-order-details-client-details horizontal-line">
                <h3>פרטי הלקוח</h3>
                <p>כתובת: {address} {city}</p>
                <p>מיקוד: {zip}</p>
                <p>טלפון: {phone}</p>
                <p>אימייל: {emails[0]}</p>
            </div>

            <div className="back-office-order-details-cart-details">
                <h2>פרטי הרכישה</h2>
                <ul>
                    {
                        income ?
                            income.map(cartItem =>
                                <BackOfficeCartItem key={cartItem.description} cartItem={cartItem}/>)
                            :
                            <p>פרטי ההזמנה חסרים :(</p>
                    }
                </ul>

                <p className="back-office-order-details-total">סה״כ לתשלום: {amountLocal}</p>
            </div>

            <NavLink to={url.origin} className="reusable-control-btn">להורדה וצפיה בקבלה</NavLink>
            {/* <button
                className="reusable-control-btn"
                onClick={() => updateOrderStatus(order, EOrderStatus.close, order.receiptId)}>
                להעברת ההזמנה לארכיון
            </button>*/}
        </div>
    );
}
