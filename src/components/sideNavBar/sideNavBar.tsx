import React, {useEffect, useState} from 'react';
import './sideNavBar.css';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {logo} from '../../assets';
import {useCart} from "../../context/cartContext.tsx";
import {GiShoppingCart} from "react-icons/gi";

const SideNavBar = () => {
    const cartContext = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const onNavBtnClicked = (path: string): void => {
        navigate(path);
        setIsOpen(!isOpen);
    }

    // add listener to back/forward browser button to close the sidebar
    // as the user click on them but without to navigate back or forward.
    useEffect(() => {

        const handleBackButton = () => {

            if (isOpen) {
                navigate(location.pathname);
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
                    <li onClick={() => onNavBtnClicked('/')}>דף הבית</li>
                    <li onClick={() => onNavBtnClicked('/pricing')}>מחירון</li>
                    <li className="cart-icon" onClick={() => onNavBtnClicked('/cart-page')}>
                        עגלת הקניות
                        <GiShoppingCart/>
                        <span>{cartContext.totalQuantityInCart}</span>
                    </li>
                    <li onClick={() => onNavBtnClicked('/about')}>אודות</li>
                    <li onClick={() => onNavBtnClicked('/contact-page')}>צור קשר</li>
                </ul>
            </nav>
            <div className={`side-bar-background ${isOpen ? 'nav-open' : ''}`} onClick={toggleNav}></div>
            <NavLink to="/">
                <img className="logo" src={logo} alt="לוגו קיפוד עם גיטרה"/>
            </NavLink>
        </div>
    );
};

export default SideNavBar;
