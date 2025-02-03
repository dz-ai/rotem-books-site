import React from "react";
import {IIncomeItem} from "../../../netlify/functions/get-order-details.mjs";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

interface IBackOfficeCartItemProps {
    cartItem: IIncomeItem;
}

export const BackOfficeCartItem: React.FC<IBackOfficeCartItemProps> = ({cartItem}) => {
    const generalContext = useGeneralStateContext();

    const {description, quantity, price} = cartItem;

    return (
        <div className="back-office-order-cart-item horizontal-line">
            <h4>{generalContext.t('backOfficeOrderDetails.book_name')}: {description}</h4>
            <div className="back-office-order-cart-item-details">
                <p className="back-office-order-cart-item-details-quantity"> {generalContext.t('backOfficeOrderDetails.quantity')}: {quantity} {generalContext.t('backOfficeOrderDetails.books')}</p>
                <span className="back-office-order-cart-item-details-quantity-separator"></span>
                <p>{generalContext.t('backOfficeOrderDetails.total_item_price')}: {quantity * price} ₪</p>
            </div>
        </div>
    );
}
