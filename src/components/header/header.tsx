import React from 'react';
import './header.css';
import SideNavBar from "../sideNavBar/sideNavBar.tsx";
import {useMediaQuery} from "react-responsive";
import {NavLink, useNavigate} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {GiShoppingCart} from "react-icons/gi";
import CartPopup from "./cartPopup.tsx";
import {logo} from "../../assets";

const Header: React.FC = () => {
    const cartContext = useCart();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});

    return (
        <header>
            {
                isSmallScreen &&
                <>
                    <nav>
                        <ul>
                            <li><SideNavBar/></li>
                            <li className="cart-icon" onClick={() => navigate('/cart-page')}>
                                עגלת הקניות
                                <GiShoppingCart/>
                                <CartPopup/>
                                <span>{cartContext.totalQuantityInCart}</span>
                            </li>
                        </ul>
                    </nav>
                </>
            }
            {
                !isSmallScreen &&
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                דף הבית
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/pricing"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                מחירון
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                אודות
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact-page"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                צור קשר
                            </NavLink>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <NavLink to="/cart-page"
                                     className={({isActive}) => isActive ? 'cart-icon active-nav-link nav-link' : 'cart-icon nav-link'}
                            >
                                עגלת הקניות
                                <GiShoppingCart/>
                                <span>{cartContext.totalQuantityInCart}</span>
                            </NavLink>
                            <CartPopup/>
                        </li>
                        <li>
                            <NavLink to="/">
                                <img
                                    className="logo"
                                    src={logo}
                                    alt="לוגו קיפוד עם גיטרה"
                                />
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            }
        </header>
    );
}

export default Header;
