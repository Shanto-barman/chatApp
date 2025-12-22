import express from "express";
import {protectRoutere} from "../middleware/auth.js";
import { getMessage, getUsersForSidebar, markMessageAsSeen } from "../controllers/messageController";


const messageRouter = express.Router();

messageRouter.get("/users", protectRoutere, getUsersForSidebar);
messageRouter.get("/:id", protectRoutere, getMessage);
messageRouter.put("mark/:id", protectRoutere, markMessageAsSeen);

export default messageRouter;