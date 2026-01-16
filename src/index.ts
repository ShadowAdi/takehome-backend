import http, { Server } from "http";
import app from "./server";
import { initializeConnection } from "./config/initialize.db";
import { PORT } from "./config/dotenv";
import { logger } from "./config/logger";
import "./config/dotenv"
import { shutdown } from "./utils/graceful-shutdown";

const server = http.createServer(app)

const startServer = async () => {
    await initializeConnection()

    server.listen(PORT, () => {
        console.log(`Server running at PORT: ${PORT}`)
        logger.info(`Server running at PORT: ${PORT}`)
    })
}

startServer()

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    logger.error(`Uncaught Exception: ${err}`)
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    logger.error(`Uncaught Rejection: ${reason}`)
    process.exit(1);
});