import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";

const app = express()

app.use(helmet())
CorsConfig(app)

export default app