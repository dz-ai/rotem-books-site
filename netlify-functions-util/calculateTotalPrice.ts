import {determinePrice} from "../shared/determine-price.ts";
import {ICartItem} from "../src/context/cartContext.tsx";

// calculate the total price on the backend to prevent tampering from the frontend.
export const calculateTotalPrice = (cart: ICartItem[], totalQuantityInCart: number): number => {
    return cart.reduce((totalPrice, cartItem: ICartItem) => {
        return totalPrice + determinePrice(cartItem.coverType, totalQuantityInCart);
    }, 0);
}
