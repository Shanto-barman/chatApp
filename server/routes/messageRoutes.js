import express from "express";
import {protectRoutere} from "../middleware/auth.js";
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController";


const messageRouter = express.Router();

messageRouter.get("/users", protectRoutere, getUsersForSidebar);
messageRouter.get("/:id", protectRoutere, getMessage);
messageRouter.put("mark/:id", protectRoutere, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoutere, sendMessage)


export default messageRouter;