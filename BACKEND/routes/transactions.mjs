import express from "express";
import db from "../db/conn.mjs"; // Ensure this file correctly exports a connection to MongoDB

const router = express.Router();

// Endpoint to fetch all transactions
router.get("/transactions2", async (req, res) => {
    try {
        const transactionsCollection = db.collection("transactions"); // Accessing the "transactions" collection in the "users" database

        // Retrieve all documents in the collection
        const transactions = await transactionsCollection.find({}).sort({ date: -1 }).toArray();

        // Return the transactions as a JSON response
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
});

export default router;
