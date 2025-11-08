import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

    const query = request.nextUrl.searchParams.get("query");

    // Replace the uri string with your connection string
    const uri = process.env.MONGO_URI;

    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');

        // Queries for a movie that has a title value of 'Back to the Future'

        const products = await inventory.aggregate([
            {
                $match: {
                    $or: [
                        { slug: { $regex: query, $options: "i" } },
                    ]
                }
            }
        ]).toArray();

        return NextResponse.json({ success: true, products })

    } finally {
        await client.close();
    }

}