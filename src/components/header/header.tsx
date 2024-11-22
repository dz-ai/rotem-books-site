import React, {useRef, useState} from 'react';
import './header.css';
import SideNavBar from "../sideNavBar/sideNavBar.tsx";
import AdminDropdown from "../sideNavBar/adminDropdown.tsx";
import CartPopup from "./cartPopup.tsx";
import {useMediaQuery} from "react-responsive";
import {NavLink, useNavigate} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";
import {useOutClick} from "../../hooks/useOutClick.ts";
import {logo} from "../../assets";
import {GiShoppingCart} from "react-icons/gi";
import {RiArrowDownWideFill, RiArrowUpWideFill} from "react-icons/ri";

const Header: React.FC = () => {
    const cartContext = useCart();
    const generalContext = useGeneralStateContext();

    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});

    const [isAdminOpen, setIsAdminOpen] = useState<boolean | string>(false);

    // admin dropdown out click
    const adminDropdownRef = useRef(null);
    const [preventOutClick, setPreventOutClick] = useState(false);
    useOutClick(adminDropdownRef, setIsAdminOpen, preventOutClick);

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
                        {
                            generalContext.isLoggedIn &&
                            <li className="admin-btn" ref={adminDropdownRef}
                                onClick={() => setIsAdminOpen(!isAdminOpen)}>

                                <span className="admin-btn-text">
                                    {
                                        !isAdminOpen ?
                                            <RiArrowDownWideFill onClick={async () => {
                                                setPreventOutClick(true);
                                                await new Promise(resolve => setTimeout(resolve));
                                                setPreventOutClick(false);
                                            }}/>
                                            :
                                            <RiArrowUpWideFill/>
                                    }
                                    Admin
                                </span>
                                {
                                    isAdminOpen &&
                                    <AdminDropdown onOptionClicked={() => setIsAdminOpen(false)}/>
                                }
                            </li>
                        }
                    </ul>
                </nav>
            }
        </header>
    );
}

export default Header;
