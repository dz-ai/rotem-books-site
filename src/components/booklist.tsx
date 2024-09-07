import React from 'react';
import Book, {IBook} from './book';
import './BookList.css';
import {cloud, mouse, fish, rabbit, little, cricket} from "../assets/images";

const books: IBook[] = [
    {title: 'הנמלה הצרצר והחורף הקר', price: 10, coverImage: cricket},
    {title: 'הארנבת החרוצה והצב', price: 12, coverImage: rabbit},
    {title: 'הדייג ודג הזהב', price: 12, coverImage: fish},
    {title: 'העכברים ומנגינת הקסמים', price: 12, coverImage: mouse},
    {title: 'עננית הרפתקנית', price: 15, coverImage: cloud},
    {title: 'כשהיינו קטנים', price: 15, coverImage: little},
];

const BookList: React.FC = () => {
    return (
        <div className="book-list">
            {books.map((book) => (
                <Book key={book.coverImage} book={book}/>
            ))}
        </div>
    );
}

export default BookList;
