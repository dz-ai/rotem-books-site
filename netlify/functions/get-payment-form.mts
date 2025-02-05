import {Handler} from '@netlify/functions';
import cookie from 'cookie';
import {IAddress, IClientDetails, IPaymentDetails} from "../../src/pages/clientDetailsPage/clientDetailsPage.tsx";

// get a credit card payment from "morning API (חשבונית ירוקה)
const handler: Handler = async (event) => {

    const dev = process.env.DEV === 'true';

    const apiKey = process.env.MORNING_API_KEY;
    const secret = process.env.MORNING_SECRET;
    const authVals = {id: `${apiKey}`, secret: `${secret}`};
    const pluginId = process.env.MORNING_PLUGIN_ID;
    const morningApiUrl = process.env.MORNING_URL;

    const urlToUse = dev ? 'https://rotem-books-test-env.netlify.app' : 'https://www.rotems-books.store';

    try {
        if (!event.body) {
            return {
                statusCode: 500,
                body: 'Error: the client details are missing',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }

        // get all the user and the payment details to create valid orderDetails Object that will be sent with the get payment form query
        const {amount, client, income}: IPaymentDetails = JSON.parse(event.body);
        const {city, street, houseNum, apartmentNum, zipCode}: IAddress = client.address;
        const createAddressString = `רחוב ${street} ${houseNum} ${apartmentNum !== '' ? 'דירה ' + apartmentNum : ''}`;
        const {name, phone, emails}: IClientDetails = client;

        const getTokenUrl = `${morningApiUrl}/account/token`;
        const getPaymentFormUrl = `${morningApiUrl}/payments/form`;

        const orderDetails = {
            description: `קניה באתר הספרים של רותם (${emails[0]})`,
            type: 400,
            lang: 'he',
            currency: 'ILS',
            vatType: 0,
            amount,
            maxPayments: 1,
            pluginId: pluginId,
            group: 100, /* activate only for the real site */
            client: {
                name,
                emails: emails,
                address: createAddressString,
                city,
                zip: `מיקוד - ${zipCode}`,
                country: "IL",
                phone,
                add: true
            },
            income,
            successUrl: `${urlToUse}/payment-success-page`,
            failureUrl: `${urlToUse}/payment-failure-page`,
            notifyUrl: `${urlToUse}/.netlify/functions/save-receipt-after-payment-success`,
        };

        // connect to the "morning" user account and get JWT token
        const tokenResponse = await fetch(getTokenUrl, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authVals),
        });

        const tokenData = await tokenResponse.json();

        // fetch the payment form from "morning" API use of the JWT token and the orderDetails Object
        const paymentFormResponse = await fetch(getPaymentFormUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}`,
            },
            body: JSON.stringify(orderDetails),
        });

        const paymentFormData = await paymentFormResponse.json();

        // save the client address as a cookie to be used later after the payment complete
        const clientDetails = ({name, email: emails[0]});
        const serializedClientDetailsInCookie: string = saveClientDetailsInCookie(clientDetails);

        // return the form url to the client
        const headers: Record<string, string> = {
            'Set-Cookie': serializedClientDetailsInCookie,
            'Content-Type': 'application/json',
        };

        return {
            statusCode: paymentFormResponse.status,
            body: JSON.stringify(paymentFormData),
            headers,
        }

    } catch (error: unknown) {
        return {
            statusCode: 500,
            body: `Error: ${error}`,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    }
};

export {handler};

function saveClientDetailsInCookie(clientDetails: { name: string, email: string }): string {
    return cookie.serialize('clientDetails', JSON.stringify(clientDetails), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60,
        path: '/',
    });
}
