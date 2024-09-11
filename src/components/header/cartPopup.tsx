import React, {useEffect, useState} from 'react';
import './cartPopup.css';
import {useNavigate} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";

const TalkBubblePopup: React.FC = () => {
    const cartContext = useCart();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<string>('');
    const [isMouseOverThePopup, setIsMouseOverThePopup] = useState<boolean>(false);
    const [animationClass, setAnimationClass] = useState<'fade-in' | 'fade-out'>('fade-in');

    // this effect open the popup to 7 seconds if there is a new message from the cart context about adding or removing items
    useEffect(() => {
        if (cartContext.changesReporter[0] !== '') {
            setPopupText(cartContext.changesReporter[0]);

            // set timeout to close the popup after 7 seconds
            let timeOut: number;
            if (!isMouseOverThePopup) {
                timeOut = setTimeout(async () => {
                    setAnimationClass('fade-out');
                    await new Promise((res) => setTimeout(res, 500));

                    setIsOpen(false);
                    setAnimationClass('fade-in');
                }, 7000);
            }

            setIsOpen(true);

            // clear time out if the effect recalled before the time is over
            return () => {
                timeOut && clearTimeout(timeOut);
            };
        }

    }, [cartContext.changesReporter, isMouseOverThePopup]);

    return (
        <>
            {
                isOpen &&
                <div
                    className={`popup-container ${animationClass}`}
                    onMouseEnter={() => setIsMouseOverThePopup(true)}
                    onMouseLeave={() => setIsMouseOverThePopup(false)}
                >
                    <div className="talk-bubble">
                        <div className="talk-text">
                            {popupText}
                        </div>
                        <div
                            className="reusable-control-btn"
                            onClick={() => navigate('/cart-page')}
                        >
                            למעבר לעגלה
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default TalkBubblePopup;
