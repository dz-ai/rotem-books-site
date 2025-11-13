import React, {useEffect, useState} from 'react';
import './book.css';
import QuantityInput from "../../componentsReusable/quantityInput/quantityInput.tsx";
import {Link} from 'react-router-dom';
import {ICartItem, useCart} from "../../context/cartContext.tsx";
import {ECoverTypeHard, ECoverTypeSoft} from "../../../shared/determine-price.ts";
import {determinePrice} from "../../../shared/determine-price.ts";
import Cookies from 'js-cookie';
import {GoTrash} from "react-icons/go";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

export type coverType = 'soft-cover' | 'hard-cover';

export interface IBook {
    id: string;
    title: string;
    price: number;
    coverImage: string;
    description: string;
    illustratorName: string;
    coverType: coverType[];
}

// if the user not adds yet any book to cart we then will use "book: IBook"
interface BookProperties {
    book: IBook;
}

// represent the book-card on the homepage
const Book: React.FC<BookProperties> = ({book}) => {
    const cartContext = useCart();
    const generalContext = useGeneralStateContext();


    const [coverType, setCoverType] = useState<coverType>(book.coverType[0]);
    const [bookPrice, setBookPrice] = useState(book.price);
    const [quantityInCart, setQuantityInCart] = useState<null | number>(null);
    const [firstLoad, setFirstLoad] = useState(true);

    // toggle between a soft and hard cover type
    const handleCoverTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation(); // prevent the click to activate the book-card onClick={} (so-called event propagation)

        const cover: coverType = e.target.value as coverType;

        setCoverType(cover);

        // update book quantity
        const bookInCart = isBookInCart(cover);
        bookInCart ? setQuantityInCart(bookInCart.quantity) : setQuantityInCart(null);

        // update price
        updatePrice(cover);

        // set Cookie to save the cover-type choice.
        Cookies.set(book.id, cover, {expires: 7});
    }

    // update the quantity of book that already exists in the cart.
    const updateQuantity = (id: string, quantity: number) => {
        setQuantityInCart(quantity);
        cartContext.updateCartItem(id, quantity, coverType);
    };

    // -- UTIL FUNCTIONS -- //
    function isBookInCart(coverType?: coverType): ICartItem | null {
        let bookInCart = null;
        if (coverType) bookInCart = cartContext.cart.find(item => item.id === book.id && item.coverType === coverType) || null;
        if (!coverType) bookInCart = cartContext.cart.find(item => item.id === book.id) || null;

        return bookInCart;
    }

    function isBookInCookie(): coverType | null {
        return Cookies.get(book.id) as coverType | null || null;
    }

    function updatePrice(coverType: coverType): void {
        const price: ECoverTypeHard | ECoverTypeSoft = determinePrice(coverType, cartContext.totalQuantityInCart);
        setBookPrice(price * (quantityInCart ? quantityInCart : 1));
    }

    // -- EFFECTS -- //

    // update the price of the book according to the quantity in the cart
    useEffect(() => {
        updatePrice(coverType);
    }, [cartContext.totalQuantityInCart, quantityInCart]);

    // on LOAD check if book in cart and update book cover and price.
    useEffect(() => {
        const bookInCart = isBookInCart();

        if (firstLoad && bookInCart) {
            setCoverType(bookInCart.coverType);
            setQuantityInCart(bookInCart.quantity);
            setFirstLoad(false);

            // if not in cart update according to the cookie
        } else if (firstLoad && !bookInCart) {
            const bookCoverInCookie = isBookInCookie();

            if (bookCoverInCookie) {
                setCoverType(bookCoverInCookie);
                updatePrice(bookCoverInCookie);
            }
        }

    }, [cartContext.cart, firstLoad]);

    return (
        <Link
            key={book.id + coverType}
            to={`/book-details/${encodeURIComponent(book.id)}?cover-type=${coverType || book.coverType[0]}`}
        >
            <div className="book">
                <img src={`${import.meta.env.VITE_IMAGEKIT_URL}/${book.coverImage}`}
                     loading="lazy"
                     alt={book.title}
                />
                <h3>{book.title}</h3>
                <div className="book-detail-question">{generalContext.t('home.bookDetailQuestion')}</div>
                {
                    book.coverType.length > 1 ?
                        <div
                            className="cover-type-container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <label className="cover-type">
                                <input
                                    type="radio"
                                    value={'hard-cover'}
                                    checked={coverType === 'hard-cover'}
                                    onChange={handleCoverTypeChange}
                                />
                                {generalContext.t('shared.hardcover')}
                            </label>
                            <label className="cover-type">
                                <input
                                    type="radio"
                                    value={'soft-cover'}
                                    checked={coverType === 'soft-cover'}
                                    onChange={handleCoverTypeChange}
                                />
                                {generalContext.t('shared.softcover')}
                            </label>
                        </div>
                        :
                        <p>{book.coverType[0] === 'soft-cover' ? generalContext.t('shared.softcover') : generalContext.t('shared.hardcover')}</p>
                }
                <p>₪{bookPrice}</p>
                <div className="add-to-cart-container">
                    {
                        !quantityInCart &&
                        <button className="reusable-control-btn" onClick={(e) => {
                            e.preventDefault();
                            setQuantityInCart(1);

                            cartContext.addToCart({
                                id: book.id,
                                title: book.title,
                                price: bookPrice,
                                image: book.coverImage,
                                coverType: coverType,
                                quantity: 1,
                            });
                        }}>
                            {generalContext.t('shared.add_to_cart')}
                        </button>
                    }
                    {
                        quantityInCart &&
                        <div className="book-add-remove-from-cart-controllers">
                            <GoTrash onClick={(e) => {
                                e.preventDefault();
                                cartContext.removeFromCart(book.id, coverType);
                                setQuantityInCart(null);
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
