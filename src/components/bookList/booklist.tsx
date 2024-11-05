import React from 'react';
import './booklist.css';
import Book from '../book/book.tsx';
import {books} from '../../App.tsx';

// render the books-cards on the homepage
const BookList: React.FC = () => {

    return (
        <div className="book-list">
            {
                books.map((book) => {
                        return (
                            <Book key={book.id} book={book}/>
                        )
                    }
                )}
        </div>
    );
}

export default BookList;
