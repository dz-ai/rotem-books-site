import React from 'react';
import './book.css';
import QuantityInput from "../../componentsReusable/quantityInput.tsx";
import {useCart} from "../../context/cartContext.tsx";
import {GoTrash} from "react-icons/go";

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
    quantityInCart: number | null;
}

// TODO on a mobile device as the user click on the book card it as blue background (some default behavior of the browser or so...)
const Book: React.FC<BookProperties> = ({book, quantityInCart}) => {
    const cartContext = useCart();

    const updateQuantity = (id: string, quantity: number) => {
        cartContext.updateCartItem(id, quantity);
    };

    return (
        <div className="book">
            <img src={book.coverImage} alt={book.title}/>
            <h3>{book.title}</h3>
            <p>₪{book.price}</p>
            <div className="add-to-cart-container">
                {
                    !quantityInCart &&
                    <button className="reusable-control-btn" onClick={(e) => {
                        e.preventDefault();
                        cartContext.addToCart({
                            id: book.id,
                            title: book.title,
                            price: book.price,
                            image: book.coverImage,
                            quantity: 1
                        });
                    }}>
                        הוסף לעגלה
                    </button>
                }
                {
                    quantityInCart &&
                    <div className="book-add-remove-from-cart-controllers">
                        <GoTrash onClick={(e) => {
                            e.preventDefault();
                            cartContext.removeFromCart(book.id);
                        }}/>
                        <QuantityInput
                            quantity={quantityInCart}
                            onIncrease={() => updateQuantity(book.id, quantityInCart + 1)}
                            onDecrease={() => updateQuantity(book.id, quantityInCart - 1)}
                            onChange={(e) => updateQuantity(book.id, parseInt(e.target.value))}
                        />
                    </div>
                }
            </div>
        </div>
    );
}

export default Book;
