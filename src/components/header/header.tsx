import React from 'react';
import './header.css';
import SideNavBar from "../sideNavBar/sideNavBar.tsx";
import {useMediaQuery} from "react-responsive";
import {NavLink, useNavigate} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {GiShoppingCart} from "react-icons/gi";

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
                                <span>{cartContext.totalQuantityINCart}</span>
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
                            <NavLink to="/cart-page"
                                     className={({isActive}) => isActive ? 'cart-icon active-nav-link' : 'cart-icon'}>
                                עגלת הקניות
                                <GiShoppingCart/>
                                <span>{cartContext.totalQuantityINCart}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/" className={({isActive}) => isActive ? 'active-nav-link' : undefined}>
                                דף הבית
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className={({isActive}) => isActive ? 'active-nav-link' : undefined}>
                                אודות
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact-page"
                                     className={({isActive}) => isActive ? 'active-nav-link' : undefined}>
                                צור קשר
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            }
        </header>
    );
}

export default Header;
