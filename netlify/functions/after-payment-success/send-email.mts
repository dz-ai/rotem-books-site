import {generateResponse} from "../../../netlify-functions-util/validateRequest.ts";

interface ISendMailPayload {
    from: string;
    to: string;
    subject: string;
    parameters: {
        requestId: string;
        url: string;
    }
}

// notify the site-owner about the purchase, ideally with a link to the purchase details.
export async function sendEmail(receiptId: string | null) {

    if (!process.env.NETLIFY_EMAILS_SECRET) return generateResponse(500, 'secret is missing');
    if (!process.env.NETLIFY_EMAILS_EMAIL_FROM) return generateResponse(500, 'email address "from" is missing');
    if (!process.env.NETLIFY_EMAILS_EMAIL_TO) return generateResponse(500, 'email address "to" is missing');
    if (!process.env.URL) return generateResponse(500, 'url is missing')

    const sendEmailPayload: ISendMailPayload = {
        from: process.env.NETLIFY_EMAILS_EMAIL_FROM,
        to: process.env.NETLIFY_EMAILS_EMAIL_TO,
        subject: `הזמנה חדשה! ${receiptId}`,
        parameters: {
            url: process.env.URL,
            requestId: receiptId || 'false',
        },
    }
    try {
        const response = await fetch(
            `${process.env.URL}/.netlify/functions/emails/new-order-notification`,
            {
                method: 'post',
                headers: {
                    'netlify-emails-secret': process.env.NETLIFY_EMAILS_SECRET,
                },
                body: JSON.stringify(sendEmailPayload),
            }
        );

        return response.status === 200;
    } catch (err) {
        console.log(err);
        return false
    }

}
