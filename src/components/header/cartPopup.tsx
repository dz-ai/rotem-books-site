import React, {useEffect, useRef, useState} from 'react';
import './cartPopup.css';
import {useLocation, useNavigate} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const TalkBubblePopup: React.FC = () => {

    const generalContext = useGeneralStateContext();

    const cartContext = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [isMouseOverThePopup, setIsMouseOverThePopup] = useState<boolean>(false);
    const [animationClass, setAnimationClass] = useState<'fade-in' | 'fade-out'>('fade-in');

    // set open popup to true and set time out to close the popup after 5 seconds if the mouse is not over the popup
    const openPopup = (isMouseOverThePopup: boolean): void => {

        timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

        if (cartContext.changesReporter[0] !== '') {
            setPopupText(cartContext.changesReporter[0]);

            // set timeout to close the popup after 5 seconds
            if (!isMouseOverThePopup) {
                timeoutIdRef.current = setTimeout(async () => {
                    setAnimationClass('fade-out');
                    await new Promise((res) => setTimeout(res, 500));

                    setIsOpen(false);
                    setAnimationClass('fade-in');
                }, 5000);
            }

            setIsOpen(true);
        }
    }

    // opens if there is a new message from the cart context about adding or removing items
    useEffect(() => {
        openPopup(isMouseOverThePopup);

        return () => {
            timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
            setIsOpen(false);
        }
    }, [cartContext.changesReporter]);

    // clos the popup as the user navigates to cart page
    useEffect(() => {
        if (location.pathname === '/cart-page') {

            // as the popup suddenly close the isMouseOver val stay, true therefor it must be set to false manually.
            setIsMouseOverThePopup(false);
            setIsOpen(false);
        }
    }, [location.pathname]);

    return (
        <>
            {
                isOpen &&
                <div
                    className={`popup-container ${animationClass}`}
                    onMouseEnter={() => {
                        setIsMouseOverThePopup(true);
                        openPopup(true);
                    }}
                    onMouseLeave={() => {
                        setIsMouseOverThePopup(false);
                        openPopup(false);
                    }}
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
                                {generalContext.t('cartPopup.goToCart')}
                            </button>
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default TalkBubblePopup;
