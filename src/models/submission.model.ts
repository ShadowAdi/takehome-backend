import { Schema } from "mongoose";

export const SubmissionRequirementsSchema = new Schema(
    {
        githubUrl: {
            required: { type: Boolean, default: false },
            description: { type: String },
        },
        deployedUrl: {
            required: { type: Boolean, default: false },
            description: { type: String },
        },
        videoDemo: {
            required: { type: Boolean, default: false },
            platform: {
                type: String,
                enum: ["loom", "youtube", "any"],
            },
            description: { type: String },
        },
        documentation: {
            required: { type: Boolean, default: false },
            description: { type: String },
        },
        otherUrls: [
            {
                label: { type: String },
                required: { type: Boolean, default: false },
                description: { type: String },
            },
        ],
        additionalInfo: {
            required: { type: Boolean, default: false },
            placeholder: { type: String },
            maxLength: { type: Number },
        },
    },
    { _id: false }
);
