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
    addToCart: (item: ICartItem) => void;
    updateCartItem: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: { children: ReactNode }) => {
    const [cart, setCart] = useState<ICartItem[]>([]);

    const updateCartItem = (id: string, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? {...item, quantity: Math.max(1, quantity)} : item
            )
        );
    };

    const addToCart = (item: ICartItem) => {
        const itemInCart: ICartItem | undefined = cart.find(cartItem => cartItem.id === item.id);
        if (itemInCart) {
            updateCartItem(item.id, itemInCart.quantity += 1);
        } else {
            setCart((prevCart) => [...prevCart, item]);
        }
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const totalQuantityINCart = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{cart, addToCart, updateCartItem, removeFromCart, totalQuantityINCart}}>
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
