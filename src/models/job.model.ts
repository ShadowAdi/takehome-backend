import mongoose from "mongoose";
import { IJob } from "./interfaces/job.interface";

export const jobSchema = new mongoose.Schema<IJob>({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    jobTitle: {
        type: String,
        required: true,
        trim: true
    },

    jobDescription: {
        type: String,
        required: true,
        trim: true
    },

    jobRole: {
        type: String,
        required: true,
        enum: ["frontend", "backend", "fullstack", "mobile", "data", "embed", "other"],
        default: "other"
    },

    experience: {
        minMonths: {
            type: Number,
            required: true,
            min: 0
        },
        maxMonths: {
            type: Number,
            required: true,
            min: 0
        }
    },

    techStack: {
        type: [String],
        required: true
    },

    employmentType: {
        type: String,
        enum: ["internship", "full-time", "contract", "part-time"],
        default: "full-time"
    },

    location: {
        type: String,
        trim: true
    },

    lastDateToApply: {
        type: Date
    },

    status: {
        type: String,
        enum: ["draft", "active", "archived"],
        default: "draft"
    }
}, {
    timestamps: true
});

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
