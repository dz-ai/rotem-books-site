import {EOrderStatus} from "../../../pages/backOffice/backOfficePage.tsx";

interface ITranslateOrderStatusReturnVal {
    status: string;
    color: string;
}

export const translateOrderStatusUtil = (status: EOrderStatus): ITranslateOrderStatusReturnVal => {
    let resultStatus = '';
    let resultColor = '';

    switch (status) {
        case EOrderStatus.new:
            resultStatus = 'חדשה';
            resultColor = 'red';
            break
        case EOrderStatus.open:
            resultStatus = 'פתוחה';
            resultColor = 'green';
            break
        case EOrderStatus.close:
            resultStatus = 'סגורה';
            resultColor = 'gray';
    }

    return {
        status: resultStatus,
        color: resultColor,
    }
}
