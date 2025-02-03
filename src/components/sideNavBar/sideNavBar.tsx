import React, {useEffect, useState} from 'react';
import './sideNavBar.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {GiShoppingCart} from "react-icons/gi";
import {RiArrowDownWideFill} from "react-icons/ri";
import {RiArrowUpWideFill} from "react-icons/ri";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import AdminDropdown from "./adminDropdown.tsx";

const SideNavBar = () => {
    const cartContext = useCart();
    const generalContext = useGeneralStateContext();

    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const onNavBtnClicked = (path: string): void => {
        if (location.pathname !== path) {
            navigate(path);
        }
        setIsOpen(!isOpen);
    }

    // add listener to back/forward browser button to close the sidebar as the user click on them
    useEffect(() => {

        const handleBackButton = () => {

            if (isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        }
    }, [isOpen]);

    return (
        <div className="side-bar-container">
            <button className="nav-toggle" onClick={toggleNav}>
                ☰
            </button>
            <nav className={`nav ${isOpen ? 'nav-open' : ''}`}>
                <button className="nav-close" onClick={toggleNav}>
                    &times;
                </button>
                <ul>
                    <li onClick={() => onNavBtnClicked('/')}>{generalContext.t('header.homeBtn')}</li>
                    <li onClick={() => onNavBtnClicked('/pricing')}>{generalContext.t('header.pricingBtn')}</li>
                    <li className="cart-icon" onClick={() => onNavBtnClicked('/cart-page')}>
                        {generalContext.t('header.cartBtn')}
                        <GiShoppingCart/>
                        <span>{cartContext.totalQuantityInCart}</span>
                    </li>
                    <li onClick={() => onNavBtnClicked('/about')}>{generalContext.t('header.aboutBtn')}</li>
                    <li onClick={() => onNavBtnClicked('/contact-page')}>{generalContext.t('header.contactBtn')}</li>
                    {
                        generalContext.isLoggedIn &&
                        <li className="admin-btn" onClick={() => setIsAdminOpen(!isAdminOpen)}>
                            {
                                !isAdminOpen ?
                                    <RiArrowDownWideFill/>
                                    :
                                    <RiArrowUpWideFill/>
                            }
                            <span className="admin-btn-text">Admin</span>
                        </li>
                    }
                    {
                        generalContext.isLoggedIn && isAdminOpen &&
                        <li className="admin-dropdown">
                            <AdminDropdown onOptionClicked={() => {
                                setIsAdminOpen(false);
                                setIsOpen(false);
                            }}/>
                        </li>
                    }
                </ul>
            </nav>
            <div className={`side-bar-background ${isOpen ? 'nav-open' : ''}`} onClick={() => setIsOpen(false)}></div>
        </div>
    );
};

export default SideNavBar;
