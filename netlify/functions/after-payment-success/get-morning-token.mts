import {generateResponse} from "../../../netlify-functions-util/validateRequest.ts";

// get token that allow access to "Morning API"
export async function getMorningToken() {

    if (!process.env.MORNING_API_KEY) return generateResponse(500, 'Morning API key is missing');
    if (!process.env.MORNING_SECRET) return generateResponse(500, 'Morning secret is missing');
    if (!process.env.MORNING_URL) return generateResponse(500, 'Morning Url is missing');

    const authVals = {id: `${process.env.MORNING_API_KEY}`, secret: `${process.env.MORNING_SECRET}`};

    try {
        const response = await fetch(
            `${process.env.MORNING_URL}/account/token`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authVals),
            }
        );

        const tokenResults = await response.json();

        if (response.status === 200) {
            return tokenResults.token;
        } else {
            console.error('token is missing', tokenResults.errorCode, tokenResults.errorMessage);
            return null;
        }

    } catch (err) {
        console.error(err);
        return err;
    }
}
