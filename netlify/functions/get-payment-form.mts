import {Handler} from '@netlify/functions';

const handler: Handler = async (event) => {
    try {
        const getTokenUrl = 'https://sandbox.d.greeninvoice.co.il/api/v1/account/token'
        const getPaymentFormUrl = 'https://sandbox.d.greeninvoice.co.il/api/v1/payments/form'

        const apiKey = process.env.API_KEY;
        const secret = process.env.SECRET;
        const authVals = {id: `${apiKey}`, secret: `${secret}`};
        // TODO get from the client through event.body
        const orderDetails = {
            description: "Just an order",
            remarks: "Some remarks",
            type: 320,
            date: "2017-12-27",
            dueDate: "2018-01-27",
            lang: "en",
            currency: "USD",
            vatType: 0,
            amount: 30,
            maxPayments: 1,
            client: {
                name: "name",
                emails: [
                    "client@example.com"
                ],
                taxId: "123456789",
                address: "1 Luria st",
                city: "Tel Aviv",
                zip: "1234567",
                country: "IL",
                phone: "+972-54-1234567",
                fax: "+972-54-1234567",
                mobile: "+972-54-1234567",
                add: true
            },
            successUrl: "https://www.your-site-here.com",
            failureUrl: "https://www.your-site-here.com",
            notifyUrl: "https://www.your-site-here.com",
            custom: "12345"
        };


        const tokenResponse = await fetch(getTokenUrl, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authVals),
        });

        const tokenData = await tokenResponse.json();

        const paymentFormResponse = await fetch(getPaymentFormUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}`,
            },
            body: JSON.stringify(orderDetails),
        });

        const paymentFormData = await paymentFormResponse.json();

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
        };
    }
};

export {handler};
