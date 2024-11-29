import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import posts from "./routes/post.mjs";
import users from "./routes/user.mjs";
import transactions2 from "./routes/transactions.mjs";
import express from "express";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const app = express();

// Enable CORS to allow requests from frontend
app.use(cors({
    origin: 'https://localhost:3000', // Allow your frontend's domain
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json()); // Middleware to parse incoming JSON requests

// Routes
app.use("/post", posts);
app.use("/user", users);
app.use("/transactions2", transactions2)


// Read SSL certificate and key
const keyPath = path.join(__dirname, 'keys', 'privatekey.pem');
const certPath = path.join(__dirname, 'keys', 'certificate.pem');

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

// Create HTTPS server
const server = https.createServer(options, app);

// Start the HTTPS server
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
