import React from 'react';
import './booklist.css';
import Book from '../book/book.tsx';
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

// render the books-cards on the homepage
const BookList: React.FC = () => {
    const generalContext = useGeneralStateContext();
    return (
        <div className="book-list">
            {
                generalContext.books.map((book) => {
                        return (
                            <Book key={book.id} book={book}/>
                        )
                    }
                )}
        </div>
    );
}

export default BookList;
