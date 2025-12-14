import express from "express";
import "dotenv/config"
import cors from "cors";
import http from "http";

//create express app and Http server

const app =express();
const server = http.createServer(app)


//Middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());





