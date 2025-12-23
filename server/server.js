import express from "express";
import "dotenv/config"
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";
//create express app and Http server

const app =express();
const server = http.createServer(app)

// Initialize socket.io server
export const io = new Server(server,{
    cors: {origin: "*"}
})

//Store online users
export const userSocketMep = {}; // {userId: socketId}

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId)

    if(userId) userSocketMep[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMep));

    socket.on("disconnect",()=>{
        console.log("User Disconnected", userId);
        delete userSocketMep[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMep))
    });
})


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





