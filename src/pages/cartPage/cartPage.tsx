import React from 'react';
import './cartPage.css';
import QuantityInput from "../../componentsReusable/quantityInput/quantityInput.tsx";
import {useNavigate} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";
import {coverType} from "../../components/book/book.tsx";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import ArrowIcon from "../../componentsReusable/arrowIcon/arrowIcon.tsx";
import {Helmet} from "react-helmet";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const cartContext = useCart();
    const generalContext = useGeneralStateContext();
    const cartItems = cartContext.cart;

    const updateQuantity = (id: string, quantity: number, coverType: coverType) => {
        cartContext.updateCartItem(id, quantity, coverType);
    };

    const removeItem = (id: string, coverType: coverType) => {
        cartContext.removeFromCart(id, coverType);
    };

    return (
        <div className="cart-wrapper">
            <Helmet>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <button className="reusable-control-btn" onClick={() => window.history.back()}>
                <ArrowIcon arrowDirection={'R'}/>
                {generalContext.t('shared.backToPreviousPage')}
            </button>
            <div className="cart-container">
                <div className="cart-header">
                    <h2>{generalContext.t('cart.cartHeader')}</h2>
                </div>
                <ul className="cart-list">
                    {cartItems.map((item) => (
                        <li key={item.id + item.coverType} className="cart-item">

                            <div className="cart-item-book-detail-container">
                                <img src={`${import.meta.env.VITE_IMAGEKIT_URL}/${item.image}`} alt={item.title}/>
                                <div className="book-title-and-cover-type">
                                    <div className="cart-item-title">{item.title}</div>
                                    <div>{item.coverType === 'hard-cover' ? generalContext.t('shared.hardcover') : generalContext.t('shared.softcover')}</div>
                                </div>

                                <div className="cart-item-price">
                                    <span>{generalContext.t('cart.pricePerUnit')}: ₪{item.price}</span>
                                    <span>{generalContext.t('cart.totalPrice')}: ₪{item.price * item.quantity}</span>
                                    {
                                        cartContext.totalQuantityInCart > 1 &&
                                        <span
                                            className="quantity-discount">{generalContext.t('cart.quantityDiscount')}</span>
                                    }
                                </div>
                            </div>

                            <div className="cart-item-buttons-container">
                                <QuantityInput
                                    quantity={item.quantity}
                                    onIncrease={() => updateQuantity(item.id, item.quantity + 1, item.coverType)}
                                    onDecrease={() => updateQuantity(item.id, item.quantity - 1, item.coverType)}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.coverType)}
                                />
                                <button className="remove-btn" onClick={() => removeItem(item.id, item.coverType)}>
                                    {generalContext.t('cart.removeFromCart')}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <h2 className="total-price">{generalContext.t('cart.totalPrice')}: ₪{cartContext.totalPrice}</h2>
                <button
                    className="reusable-control-btn"
                    disabled={cartContext.totalPrice === 0}
                    onClick={() => navigate('/client-details-page')}
                >
                    {generalContext.t('cart.checkout')}
                    <ArrowIcon arrowDirection={'L'}/>
                </button>
            </div>
        </div>

    );
};

export default CartPage;
