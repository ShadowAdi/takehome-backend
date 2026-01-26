import mongoose from "mongoose";
import { ISubmission } from "./interfaces/submission.interface";

const assessmentSubmissionSchema = new mongoose.Schema<ISubmission>({
    applicant: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        location: { type: String },
        resumeUrl: { type: String, required: true },
        linkedinUrl: { type: String },
        githubProfileUrl: { type: String },
        portfolioUrl: { type: String },
        coverLetter: { type: String },
        willingToRelocate: { type: Boolean }
    },

    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

    submissionData: {
        githubUrl: { type: String },
        deployedUrl: { type: String },
        videoDemoUrl: { type: String },
        documentationUrl: { type: String },
        otherUrls: [{
            label: { type: String, required: true },
            url: { type: String, required: true }
        }],
        additionalInfo: { type: String }
    },

    status: {
        type: String,
        enum: ["submitted", "under_review", "rejected", "selected", "on_hold"],
        default: "submitted",
        required: true
    },

    score: { type: Number },
    feedback: { type: String },

    decision: {
        outcome: { 
            type: String, 
            enum: ["reject", "select", "hold"]
        },
        messageToCandidate: { type: String },
        decidedAt: { type: Date }
    },

    nextSteps: {
        type: { 
            type: String, 
            enum: ["meeting", "call", "email", "task"]
        },
        description: { type: String },
        meeting: {
            platform: { type: String },
            meetingLink: { type: String },
            scheduledAt: { type: Date },
            durationMinutes: { type: Number }
        },
        contact: {
            email: { type: String },
            phone: { type: String }
        },
        task: {
            title: { type: String },
            instructions: { type: String },
            deadline: { type: Date }
        }
    },

    submittedAt: { type: Date, default: Date.now, required: true },
    evaluatedAt: { type: Date }
}, {
    timestamps: true
});

export const AssessmentSubmission = mongoose.models.AssessmentSubmission || mongoose.model("AssessmentSubmission", assessmentSubmissionSchema);
