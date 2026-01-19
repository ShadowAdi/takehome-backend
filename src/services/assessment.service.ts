import axios from "axios";
import { logger } from "../config/logger";
import { Assessment } from "../models/assessment.model";
import { CreateAssessmentAIDto, CreateAssessmentDto } from "../types/assessment/assessment-create.dto";
import { UpdateAssessmentDto } from "../types/assessment/assessment-update.dto";
import { AppError } from "../utils/AppError";
import { companyService } from "./company.service";
import { jobService } from "./job.service";
import { AI_API_KEY } from "../config/dotenv";
import { CreateJobDTO } from "../types/job/job-create.dto";

class AssessmentService {
    private async generateAssessmentWithSarvam(instructionForAi: string, job: CreateJobDTO): Promise<CreateAssessmentAIDto> {
        try {
            const response = await axios.post(
                'https://api.sarvam.ai/v1/chat/completions',
                {
                    messages: [
                        {
                            content: `
                            You are a senior engineering hiring manager who regularly designs take-home assessments.

                            Your task is to DESIGN ONE take-home technical assessment for the given job role.

                            INPUT DATA:

                            JOB DETAILS (existing job):
                            ${JSON.stringify(job, null, 2)}

                            ADDITIONAL INSTRUCTIONS FROM RECRUITER:
                            ${instructionForAi || "No additional instructions provided."}

                            ---

                            CRITICAL RULES (DO NOT BREAK):
                            1. Respond ONLY with valid JSON
                            2. JSON must STRICTLY match the schema described below
                            3. Do NOT add explanations, comments, or markdown
                            4. Do NOT include status field
                            5. Assume candidate is honest and skilled for the role level
                            6. Difficulty must match the experience implied by the job
                            7. Expected duration must reflect actual effort, not padding
                            8. Deadline must be logically derived from expectedDurationHours

                            ---

                            NON-NEGOTIABLE DESIGN CONSTRAINTS:
                            - DO NOT suggest generic projects unless explicitly requested:
                            ❌ Todo apps
                            ❌ Weather apps
                            ❌ Calculator apps
                            ❌ Counter/demo projects
                            - Prefer product-like features inspired by real SaaS workflows
                            - Task should feel like a small slice of a real product, not a demo

                            ---

                            TIME & DEADLINE LOGIC (IMPORTANT):
                            - expectedDurationHours = actual focused work time
                            - submissionDeadlineDays should follow this logic:
                            • 2–4 hours  → 1 day
                            • 4–6 hours  → 1–2 days
                            • 6–10 hours → 2–3 days
                            • Never give extra days without justification

                            ---

                            ASSESSMENT DESIGN GUIDELINES:
                            - Focus on practical, UI-focused, real-world tasks
                            - No complex backend logic unless job demands it
                            - API integration and basic state handling are preferred
                            - Constraints should discourage overengineering
                            - Evaluation criteria must be objective and explicit
                            - Submission requirements should be minimal and reasonable

                            ---

                            OUTPUT JSON SCHEMA (STRICT):

                            {
                            "title": string,
                            "problem_description": string,
                            "allowedTechStack": string,
                            "instructions": string,
                            "constraints": string,
                            "expectedDurationHours": number,
                            "submissionDeadlineDays": number,
                            "submissionRequirements": {
                                "githubUrl": {
                                "required": boolean,
                                "description": string
                                },
                                "deployedUrl": {
                                "required": boolean,
                                "description": string
                                },
                                "videoDemo": {
                                "required": boolean,
                                "description": string,
                                "platform": string
                                },
                                "documentation": {
                                "required": boolean,
                                "description": string
                                },
                                "otherUrls": [
                                {
                                    "required": boolean,
                                    "description": string,
                                    "label": string
                                }
                                ],
                                "additionalInfo": {
                                "required": boolean,
                                "placeholder": string,
                                "maxLength": number
                                }
                            },
                            "limitations": string,
                            "evaluation": string
                            }

                            ---

                            IMPORTANT:
                            - allowedTechStack must align with job techStack
                            - expectedDurationHours should usually be between 3–8
                            - Deadline must not exceed what is logically necessary
                            - Evaluation must explain how submissions will be judged

                            Respond ONLY with JSON.
`,
                            role: "user"

                        },
                    ],
                    model: 'sarvam-m',
                },
                {
                    headers: {
                        'api-subscription-key': AI_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                },
            );


            const rawContent = response.data?.choices?.[0]?.message?.content;
            if (!rawContent) {
                throw new Error('No summary in Sarvam response');
            }

            console.log("raw content ", rawContent)

            return rawContent
        } catch (error) {
            logger.error(`Failed to call the sarvam ai and create the assessment: ${error}`)
            console.error(`Failed to call the sarvam ai and create the assessment: ${error}`)
            throw new AppError(`Failed to call the sarvam ai and create the assessment: ${error}`, 400)
        }
    }

    public async createAssessment(payload: CreateAssessmentDto, jobId: string, companyId: string) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(`Cant create assessment if job does not exist in the first place`)
                console.error(`Cant create assessment if job does not exist in the first place`)
                throw new AppError(`Cant create assessment if job does not exist in the first place`, 401)
            }

            const isAlreadyExist = await Assessment.findOne({
                title: payload.title.toLowerCase().trim(),
                jobId: jobId
            })

            if (isAlreadyExist) {
                logger.error(`Already Exist try to update previous`)
                console.error(`Already Exist try to update previous`)
                throw new AppError(`Already Exist try to update previous`, 409)
            }

            const uniqueJobId = crypto.randomUUID().slice(-6)



            const assessment = await Assessment.create({
                ...payload,
                jobId: jobId,
                uniqueId: uniqueJobId,
                companyId: companyId
            });

            return assessment
        } catch (error: any) {
            logger.error(`Failed to create assessment service: ${error.message}`);
            console.error(`Failed to create assessment service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async createAssessmentByAi(jobId: string, companyId: string, instructionForAi: string) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(`Cant create assessment if job does not exist in the first place`)
                console.error(`Cant create assessment if job does not exist in the first place`)
                throw new AppError(`Cant create assessment if job does not exist in the first place`, 401)
            }

            const generatedOutput = await this.generateAssessmentWithSarvam(instructionForAi, exists)


            return "created"
        } catch (error: any) {
            logger.error(`Failed to create assessment by ai service: ${error.message}`);
            console.error(`Failed to create assessment by ai service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getAllAssessmentsByJob(jobId: string) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(`Cant create assessment if job does not exist in the first place`)
                console.error(`Cant create assessment if job does not exist in the first place`)
                throw new AppError(`Cant create assessment if job does not exist in the first place`, 401)
            }

            const assessments = await Assessment.find({
                jobId: jobId,
            });

            return assessments
        } catch (error: any) {
            logger.error(`Failed to get all assessments by jobid service: ${error.message}`);
            console.error(`Failed to get all assessments by jobid service ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getAllAssessmentsByCompanyId(companyId: string) {
        try {
            const exists = await companyService.findById(companyId);

            if (!exists) {
                logger.error(`Cant get assessment if company does not exist in the first place`)
                console.error(`Cant get assessment if company does not exist in the first place`)
                throw new AppError(`Cant get assessment if company does not exist in the first place`, 401)
            }

            const assessments = await Assessment.find({
                companyId: companyId,
            });

            return assessments
        } catch (error: any) {
            logger.error(`Failed to get all assessments by company service: ${error.message}`);
            console.error(`Failed to get all assessments by company service ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getSingleAssessment(assessmentId: string) {
        try {
            const assessment = await Assessment.findById(assessmentId);
            return assessment
        } catch (error: any) {
            logger.error(`Failed to get assessments: ${error.message}`);
            console.error(`Failed to get assessments: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getSingleAssessmentByUniqueId(assessmentUniqueId: string) {
        try {
            const assessment = await Assessment.findOne({
                uniqueId: assessmentUniqueId
            });
            return assessment
        } catch (error: any) {
            logger.error(`Failed to get assessments: ${error.message}`);
            console.error(`Failed to get assessments: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async deleteAssignment(assessmentId: string, companyId: string) {
        try {

            const assessment = await this.getSingleAssessment(assessmentId);

            if (!assessment) {
                logger.error(`Failed to get assessment by id`);
                console.error(`Failed to get assessment by id`);
                throw new AppError(`Failed to get assessment by id`, 403)
            }

            if (String(assessment.companyId) !== companyId) {
                logger.error(`Company id and assessment id are not same`);
                console.error(`Company id and assessment id are not same`);
                throw new AppError(`Company id and assessment id are not same`, 402)
            }

            await Assessment.findByIdAndDelete(assessmentId)


            return "Assessment has been deleted"
        } catch (error: any) {
            logger.error(`Failed to delete assessments: ${error.message}`);
            console.error(`Failed to delete assessments: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async updateAssessment(assessmentId: string, companyId: string, payload: UpdateAssessmentDto) {
        try {

            const assessment = await this.getSingleAssessment(assessmentId);

            if (!assessment) {
                logger.error(`Failed to get assessment by id`);
                console.error(`Failed to get assessment by id`);
                throw new AppError(`Failed to get assessment by id`, 403)
            }

            if (String(assessment.companyId) !== companyId) {
                logger.error(`Company id and assessment id are not same`);
                console.error(`Company id and assessment id are not same`);
                throw new AppError(`Company id and assessment id are not same`, 402)
            }

            const assessmentUpdated = await Assessment.findByIdAndUpdate(assessmentId, payload, {
                new: true
            })


            return assessmentUpdated
        } catch (error: any) {
            logger.error(`Failed to update assessments: ${error.message}`);
            console.error(`Failed to update assessments: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}

export const assessmentService = new AssessmentService();
