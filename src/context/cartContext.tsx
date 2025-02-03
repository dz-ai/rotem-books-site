import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {coverType} from "../components/book/book.tsx";
import {determinePrice} from "../components/book/determineBookPriceUtil.ts";
import {useGeneralStateContext} from "./generalStateContext.tsx";

export interface ICartItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
    coverType: coverType;
}

interface CartContextType {
    cart: ICartItem[];
    totalQuantityInCart: number;
    totalPrice: number;
    changesReporter: string[];
    addToCart: (item: ICartItem) => void;
    updateCartItem: (id: string, quantity: number, coverType: coverType) => void;
    removeFromCart: (id: string, coverType: coverType) => void;
    cleanCartCookie: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: { children: ReactNode }) => {

    const generalContext = useGeneralStateContext();

    const [firstLoad, setFirstLoad] = useState(true);
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [changesReporter, setChangesReporter] = useState<string[]>(['']);
    const [totalQuantityInCart, setTotalQuantityInCart] = useState(0);

    const updateCartItem = (id: string, quantity: number, coverType: coverType) => {

        const itemIndex = cart.findIndex(item => item.id === id && item.coverType === coverType);
        const item = cart[itemIndex];

        if (item) {
            item.quantity > quantity ?
                setChangesReporter([`${item.title} ${generalContext.t('cartPopup.removedFromCart')}`])
                :
                setChangesReporter([`${item.title} ${generalContext.t('cartPopup.addedToCart')}`]);
            cart[itemIndex] = {...item, quantity: Math.max(1, quantity)}
        }

        setCart([...cart]); // update the UI.
    }

    const addToCart = (item: ICartItem) => {
        const itemInCart: ICartItem | undefined = cart.find(cartItem => cartItem.id === item.id && cartItem.coverType === item.coverType);

        if (itemInCart) {
            updateCartItem(item.id, itemInCart.quantity += 1, item.coverType);
            setChangesReporter([`${itemInCart.title} ${generalContext.t('cartPopup.addedToCart')}`]);
        } else {
            setCart((prevCart) => [...prevCart, item]);
            setChangesReporter([`${item.title} ${generalContext.t('cartPopup.addedToCart')}`]);
        }
    }

    const removeFromCart = (id: string, coverType: coverType) => {
        setCart((prevCart) => prevCart.filter((item) => {
            if (item.id === id && item.coverType === coverType) {
                setChangesReporter([`${item.title} ${generalContext.t('cartPopup.removedFromCart')}`]);
            }
            return item.id !== id || (item.id === id && item.coverType !== coverType);
        }));
    }

    const cleanCartCookie = () => {
        setCart([]);
        Cookies.remove('cart');
    }

    // retrieve the cart stored in the cookie and set it to maintain the cart items even after the site is reloaded
    useEffect(() => {
        const cookieCart = Cookies.get('cart');
        if (cookieCart) {
            setCart(JSON.parse(cookieCart));
        }
        setFirstLoad(false);
    }, []);

    // update the cart stored in cookie as the cart value change (expires after 7 days)
    useEffect(() => {
        // at the first load, the cart is an empty array,
        // so we don't want to set it as the value of our cookie.
        if (!firstLoad) {
            Cookies.set('cart', JSON.stringify(cart), {expires: 7});
        }
    }, [cart]);

    useEffect(() => {
        updateTotalPrice();
    }, [cart]);

    useEffect(() => {
        setTotalQuantityInCart(prevState => {
            prevState = cart.reduce((total, item) => total + item.quantity, 0);
            return prevState;
        });
    }, [cart]);

    useEffect(() => {
        updateItemsPrice();
    }, [totalQuantityInCart]);

    // change the cart items values to the current used language
    useEffect(() => {
        setCart(prevState => {
            prevState = prevState.map(cartItem => {
                let newCartItem: ICartItem = {...cartItem};

                generalContext.books.forEach(book => {
                    if (book.id === cartItem.id) {
                        newCartItem = {
                            id: book.id,
                            title: book.title,
                            quantity: cartItem.quantity,
                            price: cartItem.price,
                            image: book.coverImage,
                            coverType: cartItem.coverType,
                        }
                    }
                });

                return newCartItem;
            });
            return prevState;
        })
    }, [generalContext.language]);

    function updateItemsPrice() {
        setCart(prevState =>
            prevState.map(item => {
                return {...item, price: determinePrice(item.coverType, totalQuantityInCart)};
            })
        );
    }

    function updateTotalPrice() {
        const calculateTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        setTotalPrice(calculateTotalPrice);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                totalQuantityInCart,
                totalPrice,
                changesReporter,
                addToCart,
                updateCartItem,
                removeFromCart,
                cleanCartCookie
            }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
