
import OpenAI from "openai";
import type { Roy } from "@/app/types/appTypes";
import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { OpenAI as OAI, ChatMessage } from "llamaindex";
import * as dotenv from "dotenv";
import { RoyAttributes } from "@/app/hooks/useRoy";
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

async function generateScannerOutput(roy: RoyAttributes) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are a Game Master AI Simulator for Roy: The game. simulate the past decade of the life of ${roy.name} in ${roy.currentLocation} in the year ${roy.currentYear}.
Focus on the lifeEvent and lifeHistory fields. embelish the provided data by creating  a series of life events and use them to build a narrative. Ensure that is realistic and coherent to the context.
  reply in JSON format using the Roy type.

`
            ,
        },
        {
            role: "assistant",
            content: `
                type Roy = {
    name:${roy.name};
    count:${roy.count};
    currentLocation: string;
    currentYear: ${roy.currentYear};
    bornIn: ${JSON.stringify(roy.bornIn)};
    experiences: LifeEvent[];
    lifeHistory: string;
    emotionalState: string;
}
type LifeEvent {
    type: string; 
    description: string;
    timestamp: Date;
}
`,
        },
        {
            role: "user",
            content: `Simulate a new Decade for the life simulator game`,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.5,
    });

    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}
export async function POST(request: Request) {
    const { id: uid, roy, address } = await request.json();
    console.log(roy)


    const beacon = await generateScannerOutput(roy);
    console.log(beacon, "beacon")
    const playerData = JSON.parse(beacon ? beacon : "null");
    const db = client.db("aiUniverse"); // Connect to the database
    const heroCodex = db.collection('royUniverse'); // 

    // assumed input

    llamaindex(JSON.stringify(playerData), uid);//should we modify this id?

    await heroCodex.updateOne(
        { _id: { address, uid } },
        {
            $addToSet: {
                roy: playerData,
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    return NextResponse.json(beacon)
};

