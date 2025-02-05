import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;


// In production mode, it's best to not use a global variable.
client = new MongoClient(uri, options);
clientPromise = client.connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
