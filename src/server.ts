import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors";
import { CustomErrorHandler } from "./middlewares/custom-error.middleware";
import { healthRouter } from "./routes/health.route";
import { companyRouter } from "./routes/company.route";
import { jobRouter } from "./routes/job.routes";
import { assessmentRouter } from "./routes/assessment.route";
import { submissionRouter } from "./routes/submission.route";

const app = express()

app.use(helmet())
CorsConfig(app)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/health", healthRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/submission", submissionRouter);


app.get('/', (_req, res) => {
    res.json({
        service: 'Takehome-backend',
        status: 'running',
        version: '2.1.0',
        features: {
        },
        endpoints: {
            health: '/api/health',
            assessment: '/api/assessment',
            company: '/api/company',
            job: '/api/job',
        }
    });
});

app.use(CustomErrorHandler)

export default app