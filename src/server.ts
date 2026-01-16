import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";
import { CustomErrorHandler } from "./middlewares/custom-error.middleware";
import { healthRouter } from "./routes/health.route";
import { companyRouter } from "./routes/company.route";

const app = express()

app.use(helmet())
CorsConfig(app)


app.use("/api/health", healthRouter);
app.use("/api/company", companyRouter);

app.get('/', (_req, res) => {
    res.json({
        service: 'Takehome-backend',
        status: 'running',
        version: '2.1.0',
        features: {
        },
        endpoints: {
            health: '/api/health',
        }
    });
});

app.use(CustomErrorHandler)

export default app