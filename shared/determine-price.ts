import {coverType} from "../src/components/book/book.tsx";

export enum ECoverTypeHard {
    basicPrise = 70,
    discountPrise = 60,
}

export enum ECoverTypeSoft {
    basicPrise = 40,
    towBooksPrise = 35,
    threeBooksPrise = 30,
    discountPrise = 25,
}


export function determinePrice(coverType: coverType, quantityInCart: number | null, discount?: number | null): ECoverTypeHard | ECoverTypeSoft {
    let price: number;

    if (coverType === 'hard-cover') {

        if (!quantityInCart) return ECoverTypeHard.basicPrise;

        switch (true) {
            case quantityInCart === 1:
                price = ECoverTypeHard.basicPrise;
                break
            case quantityInCart >= 2:
                price = ECoverTypeHard.discountPrise;
                break
            default :
                price = ECoverTypeHard.basicPrise;
        }
    } else {
        if (!quantityInCart) return ECoverTypeSoft.basicPrise;

        switch (true) {
            case quantityInCart === 1:
                price = ECoverTypeSoft.basicPrise;
                break
            case quantityInCart === 2:
                price = ECoverTypeSoft.towBooksPrise;
                break
            case quantityInCart === 3:
                price = ECoverTypeSoft.threeBooksPrise;
                break
            case quantityInCart >= 4:
                price = ECoverTypeSoft.discountPrise;
                break
            default :
                price = ECoverTypeSoft.basicPrise;
        }
    }
    if (discount) {
        price = price - (price / 100 * discount);
    }

    return price;
}
