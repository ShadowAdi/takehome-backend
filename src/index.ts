import http from "http";
import app from "./server";
import { initializeConnection } from "./config/initialize.db";
import { PORT } from "./config/dotenv";
import { logger } from "./config/logger";
import "./config/dotenv"

const server=http.createServer(app)

const startServer=async ()=>{
    await initializeConnection()

    server.listen(PORT,()=>{
        console.log(`Server running at PORT: ${PORT}`)
        logger.info(`Server running at PORT: ${PORT}`)
    })
}

startServer()
