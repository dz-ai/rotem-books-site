import {Handler, HandlerEvent} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {comparePassword} from "../../netlify-functions-util/checkPassword.ts";
import {generateToken} from "../../netlify-functions-util/tokenUtil.ts";
import {tokenResponseCreator} from "../../netlify-functions-util/tokenResponseCreator.ts";

// LOGIN HANDLER //
const handler: Handler = async (event: HandlerEvent) => {

    try {
        if (event.httpMethod !== 'POST') return generateResponse(405, 'Method Not Allowed');
        if (!event.body) return generateResponse(400, 'Event body is missing');

        const {email, password} = JSON.parse(event.body);

        if (!email || !password) return generateResponse(400, 'Email and password are required.');

        const userDetails = {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASS,
        };

        // Authenticate user
        let isPassValid: boolean = false;
        if (userDetails.password) {
            isPassValid = await comparePassword(password, userDetails.password);
        }

        if (userDetails.email && email === userDetails.email && isPassValid) {

            const token = generateToken(userDetails.email);
            if (!token) return generateResponse(500, 'Token generation failed');

            return tokenResponseCreator(token, 60 * 60, 200, 'Login successful!');
        } else {
            return tokenResponseCreator('', 0, 401, 'אימייל או סיסמא לא נכונים');
        }

    } catch (err) {
        console.error('login: ' + err);
        return tokenResponseCreator('', 0, 500, 'login: something went wrong');
    }
}

export {handler};
