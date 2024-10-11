import {IOrder} from "../../../pages/backOffice/backOfficePage.tsx";

export const sortOrdersUtil = (orders: IOrder[]): IOrder[] => {
    orders.sort((a, b) => {
        if (a.status === 'new' && b.status !== 'new') {
            return -1; // a comes before b
        }
        if (a.status !== 'new' && b.status === 'new') {
            return 1; // b comes before a
        }
        return 0; // no change in order
    });
    return orders;
}
