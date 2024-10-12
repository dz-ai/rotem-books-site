import React from "react";
import {ICartItem} from "../../context/cartContext.tsx";

interface IBackOfficeCartItemProps {
    cartItem: ICartItem;
}

export const BackOfficeCartItem: React.FC<IBackOfficeCartItemProps> = ({cartItem}) => {
    const {title, quantity, image, price} = cartItem;

    return (
        <div className="back-office-order-cart-item horizontal-line">
            <h4>שם הספר: {title}</h4>
            <div className="back-office-order-cart-item-details">
                <img src={`${import.meta.env.VITE_IMAGEKIT_URL}/${image}`} alt={`עמוד הכריכה ${title}`}/>
                <p className="back-office-order-cart-item-details-quantity"> כמות: {quantity} ספרים</p>
                <p>סה״כ לפריט: {quantity * price} ₪</p>
            </div>
        </div>
    );
}
