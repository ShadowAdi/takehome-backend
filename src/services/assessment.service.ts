import axios from "axios";
import { logger } from "../config/logger";
import { Assessment } from "../models/assessment.model";
import { CreateAssessmentDto } from "../types/assessment/assessment-create.dto";
import { UpdateAssessmentDto } from "../types/assessment/assessment-update.dto";
import { AppError } from "../utils/AppError";
import { companyService } from "./company.service";
import { jobService } from "./job.service";
import { AI_API_KEY } from "../config/dotenv";
import { CreateJobDTO } from "../types/job/job-create.dto";

class AssessmentService {
    private async generateAssessmentWithSarvam(instructionForAi: string, job: CreateJobDTO): Promise<any> {
        try {
            const response = await axios.post(
                'https://api.sarvam.ai/v1/chat/completions',
                {
                    messages: [
                        {
                            content: `
                            You are a senior engineering hiring manager.

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
                            6. Assessment must be realistic and industry-relevant
                            7. Difficulty must match the experience implied by the job
                            8. Expected duration should be achievable without burnout

                            ---

                            ASSESSMENT DESIGN GUIDELINES:
                            - Problem should test real-world skills for the role
                            - Use the job's techStack unless recruiter instructions override it
                            - Constraints should discourage overengineering
                            - Evaluation criteria must be objective and clear
                            - Submission requirements must be practical for a take-home task

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
                            - allowedTechStack should be a comma-separated string
                            - expectedDurationHours should be realistic (148)
                            - submissionDeadlineDays should be realistic (1–7)
                            - evaluation must describe HOW the submission will be judged

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

            await this.generateAssessmentWithSarvam(instructionForAi, exists)


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
