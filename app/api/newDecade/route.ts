import OpenAI from "openai";
import type { Roy } from "@/app/types/appTypes";
import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { OpenAI as OAI, ChatMessage } from "llamaindex";
import * as dotenv from "dotenv";
// Load environment variables from local .env file
dotenv.config();


const url = process.env.MONGODB_URL || 'mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});
const client = new MongoClient(url);
await client.connect();
// Database Name

async function llamaindex(payload: string, id: string) {
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName: "aiUniverse",
        collectionName: "royIndex", // this is where your embeddings will be stored
        indexName: "vector_index", // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore });

    const essay = payload;


    // Create Document object with essay
    const document = new Document({ text: essay, id_: id });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    await VectorStoreIndex.fromDocuments([document], { storageContext });

    console.log(
        `Successfully created embeddings in the MongoDB collection`,
    );
}

async function generateScannerOutput(roy: any) {
    const messages: any[] = [
        {
            role: "system",
            content: `Simulate a decade of the life of Roy  reply with a JSON that summarizes the past decade of Roy's life 
                type Roy = {
    uid: ${roy.uid};
    name: ${roy.roy.name};
    age: ${roy.roy.age + 10};
    count:${roy.roy.count + 1};
    finances: Finances;
    experiences: LifeEvent[];
    physicalAbility: PhysicalAbility;
    emotionalState: EmotionalState;
    spiritualBeliefs?: SpiritualBeliefs;
    lifeHistory: string[];

}
`
            ,
        },
        {
            role: "assistant",
            content: `
        ${JSON.stringify(roy.decade)}
`,
        },
        {
            role: "user",
            content: `
${JSON.stringify(roy)}

`,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 1.5,
    });

    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}
export async function POST(request: Request) {
    const { query: load } = await request.json();
    console.log(load)


    const beacon = await generateScannerOutput(load);
    console.log(beacon, "beacon")
    const playerData = JSON.parse(beacon ? beacon : "null");
    const db = client.db("aiUniverse"); // Connect to the database
    const heroCodex = db.collection('royUniverse'); // 

    // assumed input
    const attestationData = {
        _id: load.uid,
        Attestation: playerData,
    };

    llamaindex(JSON.stringify(attestationData), attestationData._id);

    await heroCodex.updateOne(

        { _id: load.roy.uid },
        {
            $addToSet: {
                roy: attestationData.Attestation
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    return NextResponse.json(beacon)
};



