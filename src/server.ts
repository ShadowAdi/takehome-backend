import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";
import { CustomErrorHandler } from "./middlewares/custom-error.middleware";
import { healthRouter } from "./routes/health.route";

const app = express()

app.use(helmet())
CorsConfig(app)


app.use("/api/health", healthRouter);

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

app.use(CustomErrorHandler)

export default app