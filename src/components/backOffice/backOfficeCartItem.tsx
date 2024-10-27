import React from "react";
import {IIncomeItem} from "../../../netlify/functions/get-order-details.mjs";

interface IBackOfficeCartItemProps {
    cartItem: IIncomeItem;
}

export const BackOfficeCartItem: React.FC<IBackOfficeCartItemProps> = ({cartItem}) => {
    const {description, quantity, price} = cartItem;

    return (
        <div className="back-office-order-cart-item horizontal-line">
            <h4>שם הספר: {description}</h4>
            <div className="back-office-order-cart-item-details">
                <p className="back-office-order-cart-item-details-quantity"> כמות: {quantity} ספרים</p>
                <p>סה״כ לפריט: {quantity * price} ₪</p>
            </div>
        </div>
    );
}
