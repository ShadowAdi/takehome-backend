import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";
import "./config/dotenv"
import { PORT } from "./config/dotenv";
import { logger } from "./config/logger";

const app=express()

app.use(helmet())
CorsConfig(app)

app.listen(PORT,()=>{
    console.log(`Your app server is running at port: ${PORT}`)
    logger.info(`Your app server is running at port: ${PORT}`)
})