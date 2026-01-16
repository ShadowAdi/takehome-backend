import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";

const app = express()

app.use(helmet())
CorsConfig(app)

app.get('/', (_req, res) => {
    res.json({
        service: 'Takehome-backend',
        status: 'running',
        version: '2.1.0',
        features: {
        },
        endpoints: {
            health: '/health',
        }
    });
});

export default app