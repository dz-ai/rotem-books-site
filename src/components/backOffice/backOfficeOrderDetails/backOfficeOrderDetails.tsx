import React from "react";
import './backOfficeOrderDetails.css'
import {IOrder} from "../../../pages/backOffice/backOfficePage.tsx";
import {BackOfficeCartItem} from "../backOfficeCartItem.tsx";
import {orderDate} from "../getOrderDateUtil.tsx";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {translateOrderStatus} from "../translateOrderStatus.ts";

interface IBackOfficeOrderDetailsProps {
    order: IOrder;
    setOpenOrderBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BackOfficeOrderDetails: React.FC<IBackOfficeOrderDetailsProps> = ({order, setOpenOrderBar}) => {
    const {payer, cart, total, date} = order;
    const {name, address, email, phone} = payer;

    const {status, color} = translateOrderStatus(order.status);

    return (
        <div className="back-office-order-details">
            <button className="reusable-control-btn" onClick={() => setOpenOrderBar(true)}>
                <MdKeyboardDoubleArrowRight/>
                לרשימת ההזמנות
            </button>

            <div className="back-office-order-details-header horizontal-line">
                <h2>{name}</h2>
                <p className={`back-office-order-details-header-status ${color}`}>
                    {status}
                </p>
                {orderDate(date)}
            </div>

            <div className="back-office-order-details-client-details horizontal-line">
                <h3>פרטי הלקוח</h3>
                <p>כתובת: {address}</p>
                <p>טלפון: {phone}</p>
                <p>אימייל: {email}</p>
            </div>

            <div className="back-office-order-details-cart-details">
                <h2>פרטי הרכישה</h2>
                <ul>
                    {
                        cart.map(cartItem =>
                            <BackOfficeCartItem key={cartItem.id} cartItem={cartItem}/>
                        )
                    }
                </ul>

                <p className="back-office-order-details-total">סה״כ לתשלום: {total}</p>
            </div>

            <button className="reusable-control-btn">להורדה וצפיה בקבלה</button>
            <button className="reusable-control-btn">להעברת ההזמנה לארכיון</button>
        </div>
    );
}
