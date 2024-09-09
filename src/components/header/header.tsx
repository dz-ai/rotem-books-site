import React from 'react';
import './header.css';
import SideNavBar from "../sideNavBar/sideNavBar.tsx";
import {useMediaQuery} from "react-responsive";
import {useNavigate} from 'react-router-dom';
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
                        <li className="cart-icon" onClick={() => navigate('/cart-page')}>
                            עגלת הקניות
                            <GiShoppingCart/>
                            <span>{cartContext.totalQuantityINCart}</span>
                        </li>
                        <li onClick={() => navigate('/')}>דף הבית</li>
                        <li onClick={() => navigate('/about')}>אודות</li>
                        <li onClick={() => navigate('/contact')}>צור קשר</li>
                    </ul>
                </nav>
            }
        </header>
    );
}

export default Header;
