import {ECoverTypeHard, ECoverTypeSoft} from "../../App.tsx";

export function determinePrice(coverType: string, quantityInCart: null | number): ECoverTypeHard | ECoverTypeSoft {
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

    return price;
}
