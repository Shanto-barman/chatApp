import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

// Allowed origins for local + production
const allowedOrigins = [
  "http://localhost:5173", 
  process.env.FRONTEND_URL  
];

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // mobile apps, postman
    if(allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Routes
app.use("/api/status", (req, res) => res.send("server is live 🚀"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Socket.io
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Online users store
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  console.log("User Connected:", userId);

  if(userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
