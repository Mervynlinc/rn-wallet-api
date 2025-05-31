import express from 'express';
import dotenv from 'dotenv';
import {connectToDatabase} from './config/db.js'; // Adjust the path as necessary
import ratelimiter from './middleware/rateLimiter.js'; // Adjust the path as necessary
import transactionRoute from './routes/transactionRoute.js';
dotenv.config();


const PORT = process.env.PORT || 3000;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware for rate limiting
app.use(ratelimiter); 
app.use ("/api/transactions", transactionRoute); // Use the transaction routes 


connectToDatabase().then(() =>{
    app.listen(PORT , () =>{
    console.log(`server running on port:${PORT}`)
})
})