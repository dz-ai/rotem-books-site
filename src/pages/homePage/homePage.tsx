import React from 'react';
import './homePage.css';
import {useMediaQuery} from "react-responsive";
import BookList from '../../components/bookList/booklist.tsx';
import {logo} from '../../assets';
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const HomePage: React.FC = () => {
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});
    const generalContext = useGeneralStateContext();

    return (
        <div className="home-page">
            {
                !isSmallScreen &&
                <img className="logo" src={logo} alt={generalContext.t('shared.logoAlt')}/>
            }
            <h1>{generalContext.t('home.title')}</h1>
            <BookList/>
        </div>
    );
}

export default HomePage;
