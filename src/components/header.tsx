import React from 'react';
import './header.css';
import SideNavBar from "./sideNavBar.tsx";
import {useMediaQuery} from "react-responsive";
import {useNavigate} from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});

    return (
        <header>
            {/*<div className="logo">Children's Bookstore</div>*/}
            {
                isSmallScreen &&
                <SideNavBar />
            }
            {
                !isSmallScreen &&
                <nav>
                    <ul>
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
