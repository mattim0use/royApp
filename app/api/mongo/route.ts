

import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";



export async function GET() {
    let aiu
    // Database Name
    // Use connect method to connect to the server
    try {
        const client = await clientPromise;

        const db = client.db("aiUniverse"); // Connect to the Database

        aiu = await db
            .collection("royUniverse")
            .find({})
            .limit(10)
            .toArray();

        return NextResponse.json(aiu); // Response to MongoClient
    } catch (e: any) {
        console.error(e);
        return NextResponse.json(e.message);
    }
    // Get all players from collection
};



