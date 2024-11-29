import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.ATLAS_URI;

if (!uri) {
    throw new Error("MongoDB connection string is missing. Add ATLAS_URI to your .env file.");
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect();
const db = client.db("users"); // Connects to the "users" database

export default db;
