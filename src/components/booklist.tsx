import React from 'react';
import Book from './book';
import './BookList.css';
import {books} from '../App';
import {Link} from "react-router-dom";

const BookList: React.FC = () => {
    return (
        <div className="book-list">
            {books.map((book) => (
                <Link key={book.coverImage} to={`/book-details/${encodeURIComponent(book.id)}`}>
                    <Book book={book}/>
                </Link>
            ))}
        </div>
    );
}

export default BookList;
