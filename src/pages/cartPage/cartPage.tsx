import React from 'react';
import './cartPage.css';
import QuantityInput from "../../componentsReusable/quantityInput/quantityInput.tsx";
import {useNavigate} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {MdKeyboardDoubleArrowLeft} from "react-icons/md";
import {coverType} from "../../components/book/book.tsx";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const cartContext = useCart();
    const cartItems = cartContext.cart;

    const updateQuantity = (id: string, quantity: number, coverType: coverType) => {
        cartContext.updateCartItem(id, quantity, coverType);
    };

    const removeItem = (id: string, coverType: coverType) => {
        cartContext.removeFromCart(id, coverType);
    };

    return (
        <div className="cart-wrapper">
            <button className="reusable-control-btn" onClick={() => window.history.back()}>
                <MdKeyboardDoubleArrowRight/>
                חזרה לדף הקודם
            </button>
            <div className="cart-container">
                <div className="cart-header">
                    <h1>עגלת הקניות</h1>
                </div>
                <ul className="cart-list">
                    {cartItems.map((item) => (
                        <li key={item.id + item.coverType} className="cart-item">

                            <div className="cart-item-book-detail-container">
                                <img src={`${import.meta.env.VITE_IMAGEKIT_URL}/${item.image}`} alt={item.title}/>
                                <div className="book-title-and-cover-type">
                                    <div className="cart-item-title">{item.title}</div>
                                    <div>{item.coverType === 'hard-cover' ? 'כריכה קשה' : 'כריכה רכה'}</div>
                                </div>

                                <div className="cart-item-price">
                                    <span>מחיר ליח׳: ₪{item.price}</span>
                                    <span>סכ״ה: ₪{item.price * item.quantity}</span>
                                    {
                                        cartContext.totalQuantityInCart > 1 &&
                                        <span className="quantity-discount">כולל הנחת כמות</span>
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
                                    הסר מהעגלה
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <h2 className="total-price">סכ״ה: ₪{cartContext.totalPrice}</h2>
                <button
                    className="reusable-control-btn"
                    disabled={cartContext.totalPrice === 0}
                    onClick={() => navigate('/client-details-page')}
                >
                    לתשלום
                    <MdKeyboardDoubleArrowLeft/>
                </button>
            </div>
        </div>

    );
};

export default CartPage;
