import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header>
            {/*<div className="logo">Children's Bookstore</div>*/}
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
