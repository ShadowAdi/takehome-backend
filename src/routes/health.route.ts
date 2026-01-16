import { Request, Response, Router } from "express";
import { logger } from "../config/logger";

export const healthRouter = Router()

healthRouter.get("/", async (request: Request, response: Response) => {
    logger.info(`Health Route is working.`)
    console.log(`Health Route is working.`)
    return response.status(200).json({
        success: true,
        message: "Health API is working"
    })
})