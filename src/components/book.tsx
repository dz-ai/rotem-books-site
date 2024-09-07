import React from 'react';
import './Book.css';

export interface IBook {
    title: string;
    price: number;
    coverImage: string;
    description?: string;
}

interface BookProperties {
    book: IBook;
}

const Book: React.FC<BookProperties> = ({book}) => {
    return (
        <div className="book">
            <img src={book.coverImage} alt={book.title}/>
            <h3>{book.title}</h3>
            <p>₪{book.price}</p>
        </div>
    );
}

export default Book;
