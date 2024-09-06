import React from 'react';
import './Book.css';

interface BookProps {
    book: {
        title: string;
        author: string;
        price: string;
        coverImage: string;
    };
}

const Book: React.FC<BookProps> = ({ book }) => {
    return (
        <div className="book">
            <img src={book.coverImage} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.price}</p>
        </div>
    );
}

export default Book;
