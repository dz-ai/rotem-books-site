import React from 'react';
import './book.css';

export interface IBook {
    id: string
    title: string;
    price: number;
    coverImage: string;
    description: string;
    illustratorName: string;
}

interface BookProperties {
    book: IBook;
}

const Book: React.FC<BookProperties> = ({book}) => {
    return (
        <div className="book">
            <img src={book.coverImage} alt={book.title}/>
            <h3>{book.title}</h3>
            <div className="add-to-cart-container">
                <p>₪{book.price}</p>
                <p className="add-to-cart-text" onClick={(e) => e.preventDefault()}>הוסף לעגלה</p>
            </div>
        </div>
    );
}

export default Book;
