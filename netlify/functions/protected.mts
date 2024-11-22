import {HandlerEvent} from "@netlify/functions";
import {generateResponse} from "../../netlify-functions-util/validateRequest.ts";
import {verifyToken} from "../../netlify-functions-util/tokenUtil.ts";
import {JwtPayload} from "jsonwebtoken";
import cookie from "cookie";

// VERIFY TOKEN HANDLER //
exports.handler = async (event: HandlerEvent) => {

    try {
        const cookies = cookie.parse(event.headers.cookie || '');

        if (!cookies.token) return generateResponse(401, 'Unauthorized');
        const token = cookies.token;

        const decoded: JwtPayload | string | null = verifyToken(token);

        if (!decoded) return generateResponse(401, 'Invalid token');

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Authorized"}),
        };
    } catch (err) {
        console.error('Verify-Token: ' + err);
        return generateResponse(500, 'Verify Token handler internal server error: ' + err);
    }
};
