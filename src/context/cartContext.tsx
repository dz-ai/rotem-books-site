import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import Cookies from 'js-cookie';
import {coverType} from "../components/book/book.tsx";
import {determinePrice} from "../components/book/determineBookPriceUtil.ts";

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
    updateCartItem: (id: string, quantity: number) => void;
    updateCoverType: (id: string, coverType: coverType) => void;
    removeFromCart: (id: string) => void;
    cleanCartCookie: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: { children: ReactNode }) => {
    const [firstLoad, setFirstLoad] = useState(true);
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [changesReporter, setChangesReporter] = useState<string[]>(['']);

    const updateCoverType = (id: string, coverType: coverType) => {
        const itemInCartIndex = cart.findIndex(item => item.id === id);
        const item = cart[itemInCartIndex];

        cart[itemInCartIndex] = {...item, coverType, price: determinePrice(coverType, item?.quantity || 1)};
        updateTotalPrice();
        setCart([...cart]);
    }

    const updateCartItem = (id: string, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                    if (item.id === id) {
                        item.quantity > quantity ?
                            setChangesReporter([`${item.title} הוסר מהעגלה`])
                            :
                            setChangesReporter([`${item.title} נוסף לעגלה`]);
                        return {...item, quantity: Math.max(1, quantity), price: determinePrice(item.coverType, quantity)};
                    } else {
                        return item;
                    }
                }
            )
        );
    };

    const addToCart = (item: ICartItem) => {
        const itemInCart: ICartItem | undefined = cart.find(cartItem => cartItem.id === item.id);

        if (itemInCart) {
            updateCartItem(item.id, itemInCart.quantity += 1);
            setChangesReporter([`${itemInCart.title} נוסף לעגלה`]);
        } else {
            const itemWithUpdatedPrice = {...item, price: determinePrice(item.coverType, item.quantity)}
            setCart((prevCart) => [...prevCart, itemWithUpdatedPrice]);
            setChangesReporter([`${item.title} נוסף לעגלה`]);
        }
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => {
            if (item.id === id) {
                setChangesReporter([`${item.title} הוסר מהעגלה`]);
            }
            return item.id !== id
        }));
    };

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

    function updateTotalPrice() {
        const calculateTotalPrice = cart.reduce((total, item) => total + item.price, 0);
        setTotalPrice(calculateTotalPrice);
    }

    const totalQuantityInCart = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                totalQuantityInCart,
                totalPrice,
                changesReporter,
                addToCart,
                updateCartItem,
                updateCoverType,
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
