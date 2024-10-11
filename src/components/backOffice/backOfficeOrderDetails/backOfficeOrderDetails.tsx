import React from "react";
import './backOfficeOrderDetails.css'
import {EOrderStatus, IOrder} from "../../../pages/backOffice/backOfficePage.tsx";
import {BackOfficeCartItem} from "../backOfficeCartItem.tsx";
import {orderDate} from "../util/getOrderDateUtil.tsx";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {translateOrderStatusUtil} from "../util/translateOrderStatusUtil.ts";

interface IBackOfficeOrderDetailsProps {
    order: IOrder;
    setOpenOrderBar: React.Dispatch<React.SetStateAction<boolean>>;
    updateOrderStatus: (order: IOrder, status: EOrderStatus, receiptId?: string) => Promise<IOrder | undefined>;
}

export const BackOfficeOrderDetails: React.FC<IBackOfficeOrderDetailsProps> = ({
                                                                                   order,
                                                                                   setOpenOrderBar,
                                                                                   updateOrderStatus
                                                                               }) => {

    const {payer, cart, total, date} = order;
    const {name, address, email, phone} = payer;

    const {status, color} = translateOrderStatusUtil(order.status);

    return (
        <div className="back-office-order-details">
            <button className="reusable-control-btn back-to-order-list" onClick={() => setOpenOrderBar(true)}>
                <MdKeyboardDoubleArrowRight/>
                לרשימת ההזמנות
            </button>

            <div className="back-office-order-details-header horizontal-line">
                <h2>{name}</h2>
                <p className={`back-office-order-details-header-status ${color}`}>
                    {status}
                </p>
                {orderDate(date)}

                <p
                    className="back-to-new-status-btn"
                    onClick={() => updateOrderStatus(order, EOrderStatus.new)}
                >
                    החזר לסטטוס ״חדשה״
                </p>
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
                        cart ?
                            cart.map(cartItem =>
                                <BackOfficeCartItem key={cartItem.id} cartItem={cartItem}/>
                            )
                            :
                            <p>פרטי ההזמנה חסרים :(</p>
                    }
                </ul>

                <p className="back-office-order-details-total">סה״כ לתשלום: {total}</p>
            </div>

            <button className="reusable-control-btn">להורדה וצפיה בקבלה</button>
            <button
                className="reusable-control-btn"
                onClick={() => updateOrderStatus(order, EOrderStatus.close, order.receiptId)}>
                להעברת ההזמנה לארכיון
            </button>
        </div>
    );
}
