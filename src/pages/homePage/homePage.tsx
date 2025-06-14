import React from 'react';
import './homePage.css';
import {Helmet} from "react-helmet";
import {useMediaQuery} from "react-responsive";
import BookList from '../../components/bookList/booklist.tsx';
import {logo} from '../../assets';
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

const HomePage: React.FC = () => {
    const isSmallScreen = useMediaQuery({query: '(max-width: 800px)'});
    const generalContext = useGeneralStateContext();

    return (
        <div className="home-page">
            <Helmet>
                <title>ספרי ילדים מאת רותם שמטוב – חנות רשמית</title>
                <meta
                    name="description"
                    content="חנות הספרים של רותם שמטוב – ספרי ילדים אהובים למכירה ישירה מהיוצרת. רכישה קלה ובטוחה בעברית."
                />
                <link rel="canonical" href="https://www.rotems-books.store/"/>
            </Helmet>
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
