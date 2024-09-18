import React from 'react';
import './cartPage.css';
import QuantityInput from "../../componentsReusable/quantityInput.tsx";
import {useNavigate} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {MdKeyboardDoubleArrowLeft} from "react-icons/md";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const cartContext = useCart();
    const cartItems = cartContext.cart;

    const updateQuantity = (id: string, quantity: number) => {
        cartContext.updateCartItem(id, quantity);
    };

    const removeItem = (id: string) => {
        cartContext.removeFromCart(id);
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="cart-wrapper">
            <button className="reusable-control-btn" onClick={() => navigate('/')}>
                <MdKeyboardDoubleArrowRight/>
                חזרה לתפריט הראשי
            </button>
            <div className="cart-container">
                <div className="cart-header">
                    <h1>עגלת הקניות</h1>
                </div>
                <ul className="cart-list">
                    {cartItems.map((item) => (
                        <li key={item.id} className="cart-item">

                            <div className="cart-item-book-detail-container">
                                <img src={item.image} alt={item.title}/>
                                <span>{item.title}</span>

                                <div className="cart-item-price">
                                    <span>₪{item.price}</span>
                                    <span>סכ״ה: ₪{item.price * item.quantity}</span>
                                </div>
                            </div>

                            <div className="cart-item-buttons-container">
                                <QuantityInput
                                    quantity={item.quantity}
                                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                />
                                <button className="remove-btn" onClick={() => removeItem(item.id)}>הסר מהעגלה</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <h2 className="total-price">סכ״ה: ₪{totalPrice}</h2>
                <button
                    className="reusable-control-btn"
                    disabled={totalPrice === 0}
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
