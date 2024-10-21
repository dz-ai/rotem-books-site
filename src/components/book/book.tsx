import React, {useEffect, useState} from 'react';
import './book.css';
import QuantityInput from "../../componentsReusable/quantityInput.tsx";
import {useCart} from "../../context/cartContext.tsx";
import {GoTrash} from "react-icons/go";
import {determinePrice} from "./determineBookPriceUtil.ts";
import {Link, useSearchParams} from 'react-router-dom';

export type coverType = 'soft-cover' | 'hard-cover';

export interface IBook {
    id: string
    title: string;
    price: number;
    coverImage: string;
    description: string;
    illustratorName: string;
    coverType: coverType[];
}

// if the user not adds yet any book to cart we then will use "book: IBook"
// but if the book exists in the cart, we want to use relevant information about quantity and cover-type from the cart.
interface BookProperties {
    book: IBook;
    quantityInCart: number | null;
    coverTypeInCart: coverType | null;
}

// represent the book-card on the homepage
const Book: React.FC<BookProperties> = ({book, quantityInCart, coverTypeInCart}) => {
    const cartContext = useCart();

    const [searchParams, setSearchParams] = useSearchParams();

    const [coverType, setCoverType] = useState<coverType>(coverTypeInCart || book.coverType[0]);
    const [bookPrice, setBookPrice] = useState(book.price);

    // toggle between a soft and hard cover type
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation(); // prevent the click to activate the book-card onClick={} (so-called event propagation)

        const cover: coverType = e.target.value as coverType;

        setCoverType(cover);
        cartContext.updateCoverType(book.id, cover);

        setSearchParams(prev => {
            prev.set(book.id, cover);
            return prev;
        });
    }

    const updateQuantity = (id: string, quantity: number) => {
        cartContext.updateCartItem(id, quantity);
    };

    // get and update the price and the cover type as the page load or the quantity/cover-type changed
    const coverTypeInUrl = searchParams.get(book.id) as coverType;
    useEffect(() => {

        if (coverTypeInUrl) {
            setCoverType(coverTypeInUrl);
        } else if (coverTypeInCart) {
            setCoverType(coverTypeInCart);
        } else {
            setCoverType(book.coverType[0]);
        }

        // set the price according to the cover-type and the quantity
        const price = determinePrice(coverType, quantityInCart);
        setBookPrice(price);

    }, [quantityInCart, coverTypeInCart, coverTypeInUrl, coverType]);

    return (
        <Link
            key={book.coverImage}
            to={`/book-details/${encodeURIComponent(book.id)}?cover-type=${coverType || book.coverType[0]}`}
        >
            <div className="book">
                <img src={`${import.meta.env.VITE_IMAGEKIT_URL}/${book.coverImage}`} loading="lazy" alt={book.title}/>
                <h3>{book.title}</h3>
                {
                    book.coverType.length > 1 ?
                        <div onClick={(e) => e.stopPropagation()}>
                            <label className="cover-type">
                                <input
                                    type="radio"
                                    value={'hard-cover'}
                                    checked={coverType === 'hard-cover'}
                                    onChange={handleRadioChange}/>
                                כריכה קשה
                            </label>
                            <label className="cover-type">
                                <input
                                    type="radio"
                                    value={'soft-cover'}
                                    checked={coverType === 'soft-cover'}
                                    onChange={handleRadioChange}/>
                                כריכה רכה
                            </label>
                        </div>
                        :
                        <p>כריכה רכה</p>
                }
                <p>₪{bookPrice}</p>
                <div className="add-to-cart-container">
                    {
                        !quantityInCart &&
                        <button className="reusable-control-btn" onClick={(e) => {
                            e.preventDefault();
                            cartContext.addToCart({
                                id: book.id,
                                title: book.title,
                                price: bookPrice,
                                image: book.coverImage,
                                coverType: coverType,
                                quantity: 1,
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
        </Link>
    );
}

export default Book;
