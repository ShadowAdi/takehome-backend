import mongoose from "mongoose";
import { ISubmission } from "./interfaces/submission.interface";

export const assessmentSubmissionSchema = new mongoose.Schema<ISubmission>({
   
}, {
    timestamps: true
});

export const AssessmentSubmission = mongoose.models.AssessmentSubmission || mongoose.model("AssessmentSubmission", assessmentSubmissionSchema);
