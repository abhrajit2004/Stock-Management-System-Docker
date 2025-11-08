import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
   
    // Replace the uri string with your connection string
    const uri = process.env.MONGO_URI;
    
    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');

        // Queries for a movie that has a title value of 'Back to the Future'
        const query = { };
        const products = await inventory.find(query).toArray();
        return NextResponse.json({ success : true, products })
    } finally {
        await client.close();
    }
    
}

export async function POST(request) {

    let body = await request.json();
    console.log(body);
   
    // Replace the uri string with your connection string
    const uri = process.env.MONGO_URI;
    
    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');

        // Queries for a movie that has a title value of 'Back to the Future'
        const product = await inventory.insertOne(body);
        return NextResponse.json({ product, ok: true })
    } finally {
        await client.close();
    }
    
}