import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";
import "./config/dotenv"

const app=express()

app.use(helmet())
CorsConfig(app)