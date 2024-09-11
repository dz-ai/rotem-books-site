import React, {useState} from 'react';
import './sideNavBar.css';
import {NavLink, useNavigate} from 'react-router-dom';
import {logo} from '../../assets';
import {useCart} from "../../context/cartContext.tsx";
import {GiShoppingCart} from "react-icons/gi";

const SideNavBar = () => {
    const cartContext = useCart();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const onNavBtnClicked = (path: string): void => {
        navigate(path);
        setIsOpen(!isOpen);
    }

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
                    <li className="cart-icon" onClick={() => onNavBtnClicked('/cart-page')}>
                        עגלת הקניות
                        <GiShoppingCart/>
                        <span>{cartContext.totalQuantityINCart}</span>
                    </li>
                    <li onClick={() => onNavBtnClicked('/about')}>אודות</li>
                    <li onClick={() => onNavBtnClicked('/contact-page')}>צור קשר</li>
                </ul>
            </nav>
            <NavLink to="/">
                <img className="logo" src={logo} alt="לוגו קיפוד עם גיטרה"/>
            </NavLink>
        </div>
    );
};

export default SideNavBar;
