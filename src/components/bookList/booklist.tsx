import React from 'react';
import './booklist.css';
import Book from '../book/book.tsx';
import {books} from '../../App.tsx';
import {Link} from "react-router-dom";
import {useCart} from "../../context/cartContext.tsx";

const BookList: React.FC = () => {
    const cartContext = useCart();
    const cart = cartContext.cart;
    const cartsItemsId = cart.map(item => item.id);

    return (
        <div className="book-list">
            {books.map((book) => {
                    const bookQuantity = cartsItemsId.includes(book.id) ?
                        cart[cartsItemsId.indexOf(book.id)].quantity
                        :
                        null;

                    return (
                        <Link key={book.coverImage} to={`/book-details/${encodeURIComponent(book.id)}`}>
                            <Book book={book} quantityInCart={bookQuantity}/>
                        </Link>
                    )
                }
            )}
        </div>
    );
}

export default BookList;
