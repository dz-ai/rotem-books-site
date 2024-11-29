import {tokenResponseCreator} from "../../netlify-functions-util/tokenResponseCreator.ts";
import {Handler} from "@netlify/functions";

// LOGOUT HANDLER //
const handler: Handler = async () => {
    try {
        return tokenResponseCreator('', 0, 200, 'Logged out');
    } catch (err) {
        console.error('logout: ', err);
        return tokenResponseCreator('', 0, 500, 'logout: something went wrong');
    }
};

export {handler};
