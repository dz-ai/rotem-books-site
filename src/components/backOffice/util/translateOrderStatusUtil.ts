interface ITranslateOrderStatusReturnVal {
    status: string;
    color: string;
}

export const translateOrderStatusUtil = (status: number): ITranslateOrderStatusReturnVal => {
    let resultStatus = '';
    let resultColor = '';

    switch (status) {
        case 0:
            resultStatus = 'פתוחה';
            resultColor = 'violet';
            break
        case 2 || 1:
            resultStatus = 'סגורה';
            resultColor = 'gray';
            break
        case 4:
            resultStatus = 'מבוטלת';
            resultColor = 'orange';
            break
        case 3:
            resultStatus = 'מסמך מבטל';
            resultColor = 'yellow';

    }

    return {
        status: resultStatus,
        color: resultColor,
    }
}
