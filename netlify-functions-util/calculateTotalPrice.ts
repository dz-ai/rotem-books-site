import {determinePrice} from "../shared/determine-price.ts";
import {ICartItem} from "../src/context/cartContext.tsx";

// calculate the total price on the backend to prevent tampering from the frontend.
export const calculateTotalPrice = async (cart: ICartItem[], totalQuantityInCart: number, couponCode?: string): Promise<number> => {
    let discount = null;

    if (couponCode !== '') {
        try {
            const couponResponse = await fetch(`${process.env.URL}/.netlify/functions/get-coupon?code=${couponCode}`);

            if (couponResponse.status === 200) {
                discount = await couponResponse.json();
            } else {
                console.error('The Coupon-Code is not valid');
            }

        } catch (err) {
            console.error(err);
        }
    }

    return cart.reduce((totalPrice, cartItem: ICartItem) => {
        return totalPrice + determinePrice(cartItem.coverType, totalQuantityInCart, discount) * cartItem.quantity;
    }, 0);
}
