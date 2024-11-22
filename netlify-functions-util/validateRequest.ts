// generate response helper function
export const generateResponse = (statusCode: number, message: string) => {
    statusCode !== 200 &&
    console.error(statusCode, message);

    return {
        statusCode,
        body: JSON.stringify({message}),
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

// validate req helper function for method and the basic database env variable
export const validateRequest = (event: any, method: string) => {
    if (event.httpMethod !== method) {
        return generateResponse(405, 'NOT ALLOWED - only POST request allowed');
    }

    if (!process.env.MONGODB_DATABASE) {
        return generateResponse(500, 'Server configuration error, env variable - MONGODB_DATABASE not found');
    }

    return null;
}
