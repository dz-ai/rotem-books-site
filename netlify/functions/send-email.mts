import type {Handler} from "@netlify/functions";

interface ISendMailPayload {
    from: string;
    to: string;
    subject: string;
    parameters: {
        requestId: string;
        url: string;
    }
}

export interface ISendMailEventBody extends Omit<ISendMailPayload, 'from' | 'to'> {
}

const handler: Handler = async function (event) {

    try {

        if (event.body === null) {
            return {
                statusCode: 400,
                body: JSON.stringify('Payload required'),
            };
        }
        if (!process.env.NETLIFY_EMAILS_SECRET) return {
            statusCode: 500,
            body: JSON.stringify('secret is missing'),
        }

        if (!process.env.NETLIFY_EMAILS_EMAIL_FROM) return {
            statusCode: 500,
            body: JSON.stringify('email address "from" is missing'),
        };

        if (!process.env.NETLIFY_EMAILS_EMAIL_TO) return {
            statusCode: 500,
            body: JSON.stringify('email address "from" is missing'),
        };

        if (!process.env.URL) return {
            statusCode: 500,
            body: JSON.stringify('url from .env is missing'),
        };

        const {subject, parameters}: ISendMailEventBody = JSON.parse(event.body);

        const sendEmailPayload: ISendMailPayload = {
            from: process.env.NETLIFY_EMAILS_EMAIL_FROM,
            to: process.env.NETLIFY_EMAILS_EMAIL_TO,
            subject,
            parameters: {
                url: process.env.URL,
                requestId: parameters.requestId,
            },
        }

        const response = await fetch(
            `${process.env.URL}/.netlify/functions/emails/new-order-notification`,
            {
                headers: {
                    'netlify-emails-secret': process.env.NETLIFY_EMAILS_SECRET,
                },
                method: 'post',
                body: JSON.stringify(sendEmailPayload),
            }
        );

        const results = response.json();

        return {
            statusCode: 200,
            body: JSON.stringify('Email sent successfully!' + `${results}`),
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: 'error' + err
        }
    }

};

export {handler};
