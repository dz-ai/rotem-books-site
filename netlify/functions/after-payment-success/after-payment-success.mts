import {Handler} from "@netlify/functions";
import cookie from "cookie";
import {getReceipt} from "./get-receipt.mjs";
import {sendEmail} from "./send-email.mjs";
import {getMorningToken} from "./get-morning-token.mjs";
import {generateResponse} from "../../../netlify-functions-util/validateRequest.ts";

// after a successful payment, email the site owner and get the receipt to allow the client to download it immediately.
const handler: Handler = async (event) => {

    // get client details from the cookie (saved in the cookie on the get-payment form)
    const cookies = cookie.parse(event.headers.cookie || '');
    let clientDetails
    if (cookies.clientDetails) {
        clientDetails = JSON.parse(cookies.clientDetails);
    } else {
        console.error('client details missing in the cookie');
    }

    try {
        let intervalGetReceipt: NodeJS.Timeout | undefined;
        let timeoutDeadline: NodeJS.Timeout | undefined;

        // --- GET RECEIPT AND RECEIPT ID --- //
        type TReceiptResult = null | { receiptUrl: string, receiptId: string };

        const token: string | null = await getMorningToken();
        if (!token) return generateResponse(401, 'token is missing');

        let receiptResult: TReceiptResult = null;

        if (clientDetails) {

            receiptResult =
                await new Promise(resolve => {
                    if (!token) resolve(null);

                    let receipt: TReceiptResult = null;

                    // Since we are at the moment right after payment, it might be that the receipt is not yet available at the API,
                    // so we want to tray a couple of times, until it will be there to fetch. Hence, is the use of interval necessary.
                    intervalGetReceipt = setInterval(async () => {

                        const receiptResponse = await getReceipt(token, clientDetails.email, clientDetails.username);

                        if (receiptResponse) {
                            const {receiptUrl, receiptId} = receiptResponse;
                            receipt = {receiptUrl, receiptId};
                            resolve({receiptUrl, receiptId});
                        }
                    }, 1000);

                    // we stop the process if nothing happen after 5 seconds.
                    timeoutDeadline = setTimeout(() => {
                        clearInterval(intervalGetReceipt);

                        if (receipt) {
                            resolve(receipt);
                        } else {
                            resolve(null);
                        }

                    }, 15 * 1000);
                });

        }

        // --- SEND EMAIL TO THE SITE OWNER --- //
        const sendEmailResults = await sendEmail(receiptResult?.receiptId || null);


        // clear client details from the cookie
        const headers: Record<string, string> = {
            'Set-Cookie': clearClientDetailsCookie(),
            'Content-Type': 'application/json',
        };

        // send back the results to the frontend (receipt and email sent successfully: true/false).
        return {
            statusCode: 200,
            body: JSON.stringify({
                receiptUrl: receiptResult ? receiptResult.receiptUrl : null,
                emailSandingResult: sendEmailResults,
            }),
            headers,
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: err}),
        };
    }


}

// setting maxAge to 0 removes the cookie
function clearClientDetailsCookie(): string {
    return cookie.serialize('clientDetails', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });
}

export {handler};
