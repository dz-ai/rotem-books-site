import React from 'react';
import './booklist.css';
import Book from '../book/book.tsx';
import {books} from '../../App.tsx';
import {useCart} from "../../context/cartContext.tsx";

// render the books-cards on the homepage
const BookList: React.FC = () => {
    const cartContext = useCart();
    const cart = cartContext.cart;
    const cartsItemsId = cart.map(item => item.id);

    return (
        <div className="book-list">
            {
                books.map((book) => {

                        // update the quantity cover-type and the price if the book already in the cart
                        let bookQuantity = null;
                        let coverTypeInCart = null;

                        if (cartsItemsId.includes(book.id)) {
                            bookQuantity = cart[cartsItemsId.indexOf(book.id)].quantity;
                            coverTypeInCart = cart[cartsItemsId.indexOf(book.id)].coverType;
                            book = {...book, price: cart[cartsItemsId.indexOf(book.id)].price};
                        }

                        return (
                            <Book
                                key={book.id}
                                book={book}
                                quantityInCart={bookQuantity}
                                coverTypeInCart={coverTypeInCart}
                            />
                        )
                    }
                )}
        </div>
    );
}

export default BookList;
