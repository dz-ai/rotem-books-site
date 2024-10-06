import {Handler} from '@netlify/functions';

interface EventQueryStringParameters {
    [p: string]: string | undefined
}


// get address auto complete search results from Google-API
const handler: Handler = async (event) => {

    const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY

    try {
        if (event.queryStringParameters) {
            const {query}: EventQueryStringParameters = event.queryStringParameters;

            // get place suggestions from Google Places API
            const placesResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&type=address&language=he&key=${GOOGLE_MAP_API_KEY}&components=country:il|country:ps`
            );

            const places = await placesResponse.json();

            // create string Array of the result addresses
            type TPlace = { description: string }
            const searchResults: string[] = places.predictions.map((place: TPlace) => place.description);

            // send the Result Array with the addresses back to the client
            return {
                statusCode: 200,
                body: JSON.stringify(searchResults),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify('server error'),
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error}),
        };
    }
};

export {handler};
