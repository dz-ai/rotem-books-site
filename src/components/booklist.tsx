import React from 'react';
import Book from './book';
import './BookList.css';

const books = [
    { title: "Book 1", author: "Author 1", price: "$10", coverImage: "path_to_image1" },
    { title: "Book 2", author: "Author 2", price: "$12", coverImage: "path_to_image2" },
    { title: "Book 2", author: "Author 2", price: "$12", coverImage: "path_to_image2" },
    { title: "Book 2", author: "Author 2", price: "$12", coverImage: "path_to_image2" },
    { title: "Book 2", author: "Author 2", price: "$12", coverImage: "path_to_image2" },
    // Add more books here
];

const BookList: React.FC = () => {
    return (
        <div className="book-list">
            {books.map((book, index) => (
                <Book key={index} book={book} />
            ))}
        </div>
    );
}

export default BookList;
