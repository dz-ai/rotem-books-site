import React from 'react';
import BookList from '../components/booklist';
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <h1>הספרים של רותם</h1>
            <BookList />
        </div>
    );
}

export default HomePage;
