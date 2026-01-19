import mongoose, { Schema } from "mongoose";
import { IAssessment } from "./interfaces/assessment.interface";
import { SubmissionRequirementsSchema } from "./submission.model";

const AssessmentSchema = new Schema<IAssessment>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        jobId: {
            type: String,
            required: true,
            index: true,
            ref: 'Job',
        },

        problem_description: {
            type: String,
            required: true,
        },

        allowedTechStack: {
            type: String,
        },

        instructions: {
            type: String,
        },

        constraints: {
            type: String,
        },

        expectedDurationHours: {
            type: Number,
            min: 0,
        },

        submissionDeadlineDays: {
            type: Number,
            min: 0,
        },

        submissionRequirements: {
            type: SubmissionRequirementsSchema,
        },

        limitations: {
            type: String,
        },

        evaluation: {
            type: String,
        },

        status: {
            type: String,
            enum: ["draft", "active", "closed"],
            default: "draft",
        },
    },
    {
        timestamps: true,
    }
);


export const Assessment = mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);
