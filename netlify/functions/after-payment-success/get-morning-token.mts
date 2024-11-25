// get token that allow access to "Morning API"
export async function getMorningToken(): Promise<string | null> {

    if (!process.env.MORNING_API_KEY) console.error('Morning API key is missing');
    if (!process.env.MORNING_SECRET) console.error('Morning secret is missing');
    if (!process.env.MORNING_URL) console.error('Morning Url is missing');

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
        return null;
    }
}
