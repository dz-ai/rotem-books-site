import {language} from "../../../context/generalStateContext.tsx";

interface ITranslateOrderStatusReturnVal {
    status: string;
    color: string;
}

export const translateOrderStatusUtil = (status: number, lang: language): ITranslateOrderStatusReturnVal => {
    let resultStatus = '';
    let resultColor = '';

    switch (status) {
        case 0:
            resultStatus = lang === 'he' ? 'פתוחה' : 'open';
            resultColor = 'violet';
            break
        case 2 || 1:
            resultStatus = lang === 'he' ? 'סגורה' : 'closed';
            resultColor = 'gray';
            break
        case 4:
            resultStatus = lang === 'he' ? 'מבוטלת' : 'cancelled';
            resultColor = 'orange';
            break
        case 3:
            resultStatus = lang === 'he' ? 'מסמך מבטל' : 'Canceling document';
            resultColor = 'yellow';

    }

    return {
        status: resultStatus,
        color: resultColor,
    }
}
