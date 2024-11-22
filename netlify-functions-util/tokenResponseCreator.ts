import cookie from "cookie";

type THeader = { headers: { "Set-Cookie": string }, statusCode: number, body: string };

export function tokenResponseCreator(tokenVal: string, maxAge: number, statusCode: number, message: string): THeader {
    return {
        headers: {
            'Set-Cookie': cookie.serialize('token', tokenVal, {
                httpOnly: true,
                secure: process.env.dev === 'false',
                maxAge,
                path: '/',
            })
        },
        statusCode,
        body: JSON.stringify({
            message
        }),
    };
}
