import {Handler} from '@netlify/functions';
import {IAddress, IClientDetails, IPaymentDetails} from "../../src/pages/clientDetailsPage/clientDetailsPage.tsx";

// get a credit card payment from "morning API (חשבונית ירוקה)
const handler: Handler = async (event) => {

    const apiKey = process.env.MORNING_API_KEY;
    const secret = process.env.MORNING_SECRET;
    const authVals = {id: `${apiKey}`, secret: `${secret}`};
    const pluginId = process.env.PLUGIN_ID;

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
        const {amount, client, income, remarks}: IPaymentDetails = JSON.parse(event.body);
        const {city, street, houseNum, apartmentNum, zipCode}: IAddress = client.address;
        const createAddressString = `רחוב ${street} ${houseNum} ${apartmentNum !== '' ? 'דירה ' + apartmentNum : ''}`;
        const {name, phone, emails}: IClientDetails = client;

        const getTokenUrl = 'https://sandbox.d.greeninvoice.co.il/api/v1/account/token'
        const getPaymentFormUrl = 'https://sandbox.d.greeninvoice.co.il/api/v1/payments/form'

        const orderDetails = {
            description: "קבלה עבור רכישה באתר ״הספרים של רותם״",
            type: 400,
            lang: 'he',
            currency: 'ILS',
            vatType: 0,
            amount,
            maxPayments: 1,
            pluginId: pluginId,
            group: 100,
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
            income, /* the items */
            remarks,
            successUrl: "https://rotems-books-site.netlify.app/payment-success-page",
            failureUrl: "https://rotems-books-site.netlify.app/payment-failure-page",
            notifyUrl: "https://rotems-books-site.netlify.app/.netlify/functions/save-receipt-after-payment-success",
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

        // return the form url to the client
        return {
            statusCode: paymentFormResponse.status,
            body: JSON.stringify(paymentFormData),
            headers: {
                'Content-Type': 'application/json',
            },
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
