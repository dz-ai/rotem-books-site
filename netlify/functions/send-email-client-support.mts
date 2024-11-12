import type {Handler} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";

interface ISendMailPayload {
    from: string;
    to: string;
    subject: string;
    parameters: {
        name: string;
        content: string;
        email: string;
        phone: string;
    }
}

export interface ISendMailClientSupportPayLoad {
    subject: string;
    name: string;
    content: string;
    email: string;
    phone: string;
}

const handler: Handler = async function (event) {

    if (event.body === null) return generateResponse(400, 'new-order-notification');
    if (!process.env.NETLIFY_EMAILS_SECRET) return generateResponse(500, 'secret is missing');
    if (!process.env.NETLIFY_EMAILS_EMAIL_FROM) return generateResponse(500, 'email address "from" is missing');
    if (!process.env.NETLIFY_EMAILS_EMAIL_TO) return generateResponse(500, 'email address "from" is missing');

    try {
        const {subject, name, content, email, phone}: ISendMailClientSupportPayLoad = JSON.parse(event.body);

        const sendEmailPayload: ISendMailPayload = {
            from: process.env.NETLIFY_EMAILS_EMAIL_FROM,
            to: process.env.NETLIFY_EMAILS_EMAIL_TO,
            subject,
            parameters: {
                name,
                content,
                email,
                phone,
            },
        }

        const response = await fetch(
            `${process.env.URL}/.netlify/functions/emails/client-email-support`,
            {
                headers: {
                    'netlify-emails-secret': process.env.NETLIFY_EMAILS_SECRET,
                },
                method: 'post',
                body: JSON.stringify(sendEmailPayload),
            }
        );

        if (response.status !== 200) generateResponse(response.status, response.statusText);

        const results = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({message: results.message, status: response.status}),
        };

    } catch (err) {
        console.error(err);
        return generateResponse(500, 'error' + err);
    }

};

export {handler};
