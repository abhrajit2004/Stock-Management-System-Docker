import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
   
    // Replace the uri string with your connection string
    const uri = process.env.MONGO_URI;
    
    const client = new MongoClient(uri);

    try {
        const database = client.db('binarystock');
        const movies = database.collection('inventory');

        // Queries for a movie that has a title value of 'Back to the Future'
        const query = { };
        const movie = await movies.find(query).toArray();

        console.log(movie);
        return NextResponse.json({ "a": 34, movie})
    } finally {
        await client.close();
    }
    
}
