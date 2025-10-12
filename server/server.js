import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB()

const app = express();
app.use(cors()); // ✅ gọi đúng hàm

// clerk middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerk webhook
app.use("api/clerk", clerkWebhooks) 

app.get("/", (req, res) => res.send("hello"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
