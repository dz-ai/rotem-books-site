import React, {useRef, useState} from 'react';
import './header.css';
import SideNavBar from "../sideNavBar/sideNavBar.tsx";
import AdminDropdown from "../sideNavBar/adminDropdown.tsx";
import CartPopup from "./cartPopup.tsx";
import {useMediaQuery} from "react-responsive";
import {NavLink, useNavigate} from 'react-router-dom';
import {useCart} from "../../context/cartContext.tsx";
import {language, useGeneralStateContext} from "../../context/generalStateContext.tsx";
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
                        <ul className={generalContext.language === 'he' ? "mobile-nav he-language" : "mobile-nav"}>
                            <li><SideNavBar/></li>
                            <NavLink to="/">
                                <img className="logo" src={logo} alt={generalContext.t('shared.logoAlt')}/>
                            </NavLink>
                            <li className="cart-icon" onClick={() => navigate('/cart-page')}>
                                {generalContext.t('header.cartBtn')}
                                <GiShoppingCart/>
                                <CartPopup/>
                                <span>{cartContext.totalQuantityInCart}</span>
                            </li>
                            <li className="language-selection">
                                <select
                                    value={generalContext.language}
                                    onChange={(e) => {
                                        const val: language | undefined = e.target.value === 'en ' || 'he' || 'de' ? e.target.value as language : undefined;
                                        val &&
                                        generalContext.setLanguage(val);
                                    }}
                                >
                                    <option value="he">he</option>
                                    <option value="en">en</option>
                                    <option value="de">de</option>
                                </select>
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
                                {generalContext.t('header.homeBtn')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/pricing"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                {generalContext.t('header.pricingBtn')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                {generalContext.t('header.aboutBtn')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact-page"
                                     className={({isActive}) => isActive ? 'active-nav-link nav-link' : 'nav-link'}>
                                {generalContext.t('header.contactBtn')}
                            </NavLink>
                        </li>
                    </ul>
                    <ul>
                        <li className="language-selection">
                            <select onChange={(e) => {
                                const val: language | undefined = e.target.value === 'en ' || 'he' || 'de' ? e.target.value as language : undefined;
                                val &&
                                generalContext.setLanguage(val);
                            }}>
                                <option value="he">he</option>
                                <option value="en">en</option>
                                <option value="de">de</option>
                            </select>
                        </li>
                        <li>
                            <NavLink to="/cart-page"
                                     className={({isActive}) => isActive ? 'cart-icon active-nav-link nav-link' : 'cart-icon nav-link'}
                            >
                                {generalContext.t('header.cartBtn')}
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
                                    alt={generalContext.t('shared.logoAlt')}
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
