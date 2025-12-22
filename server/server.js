import express from "express";
import "dotenv/config"
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoutes.js";

//create express app and Http server

const app =express();
const server = http.createServer(app)


//Middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());


//Routers setup
app.use("/api/status", (req, res)=>res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

//Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("server is running on PORT:" + PORT));





