import React, {useEffect, useRef, useState} from 'react';
import './cartPopup.css';
import {useLocation, useNavigate} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";

const TalkBubblePopup: React.FC = () => {
    const cartContext = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [isMouseOverThePopup, setIsMouseOverThePopup] = useState<boolean>(false);
    const [animationClass, setAnimationClass] = useState<'fade-in' | 'fade-out'>('fade-in');

    // this effect opens the popup to 7 seconds
    // if there is a new message from the cart context about adding or removing items
    useEffect(() => {
        if (cartContext.changesReporter[0] !== '') {
            setPopupText(cartContext.changesReporter[0]);

            // set timeout to close the popup after 7 seconds
            if (!isMouseOverThePopup) {
                timeoutIdRef.current = setTimeout(async () => {
                    setAnimationClass('fade-out');
                    await new Promise((res) => setTimeout(res, 500));

                    setIsOpen(false);
                    setAnimationClass('fade-in');
                }, 5000);
            }

            setIsOpen(true);

            // clear time out if the effect recalled before the time is over
            return () => {
                timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
                setIsOpen(false);
            };
        }

    }, [cartContext.changesReporter, isMouseOverThePopup]);

    // clos the popup as the user navigates to cart page
    useEffect(() => {
        if (location.pathname === '/cart-page') {
            setIsMouseOverThePopup(prevState => {
                prevState = false;
                return prevState;
            });
            setIsOpen(false);
        }
    }, [location.pathname]);

    return (
        <>
            {
                isOpen &&
                <div
                    className={`popup-container ${animationClass}`}
                    onMouseEnter={() => setIsMouseOverThePopup(true)}
                    onMouseLeave={() => setIsMouseOverThePopup(false)}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="talk-bubble">
                        <div className="talk-text">
                            {popupText}
                        </div>
                        {
                            location.pathname !== '/cart-page' && cartContext.cart.length !== 0 &&
                            <button
                                className="reusable-control-btn"
                                onClick={() => navigate('/cart-page')}
                            >
                                למעבר לעגלה
                            </button>
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default TalkBubblePopup;
