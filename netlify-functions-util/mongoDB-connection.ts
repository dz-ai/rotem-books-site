import {MongoClient} from 'mongodb';

const uri = process.env.MONGODB_URI as string;

// init the mongoClient instance without to resolve the promise
// the connection initiation happen only once as long as the function environment continue to run (warm start)
// and this way inside the handlers we will resolve the same promise that has been initiate hear as many times as we need
// without to create the promise (the connection) again and again
const client = new MongoClient(uri);
export const mongoClientPromise = client.connect();
