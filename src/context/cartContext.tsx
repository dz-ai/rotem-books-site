import React, {createContext, useContext, useState, ReactNode} from 'react';

export interface ICartItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
}

interface CartContextType {
    cart: ICartItem[];
    totalQuantityINCart: number;
    changesReporter: string[];
    addToCart: (item: ICartItem) => void;
    updateCartItem: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: { children: ReactNode }) => {
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [changesReporter, setChangesReporter] = useState<string[]>(['']);

    const updateCartItem = (id: string, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                    if (item.id === id) {
                        item.quantity > quantity ?
                            setChangesReporter([`${item.title} הוסר מהעגלה`])
                            :
                            setChangesReporter([`${item.title} נוסף לעגלה`]);
                        return {...item, quantity: Math.max(1, quantity)};
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
            setCart((prevCart) => [...prevCart, item]);
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

    const totalQuantityINCart = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{cart, totalQuantityINCart, changesReporter, addToCart, updateCartItem, removeFromCart}}>
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
