import React from 'react';
import BookList from '../components/booklist';
import './homePage.css';
import {logo} from '../assets';
import {useMediaQuery} from "react-responsive";

const HomePage: React.FC = () => {
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});
    return (
        <div className="home-page">
            {
                !isSmallScreen &&
                <img className="logo" src={logo} alt="logo child read a book"/>
            }
            <h1>הספרים של רותם</h1>
            <BookList/>
        </div>
    );
}

export default HomePage;
