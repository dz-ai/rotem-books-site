import React from 'react';
import './homePage.css';
import {useMediaQuery} from "react-responsive";
import BookList from '../../components/bookList/booklist.tsx';
import {logo} from '../../assets';

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
