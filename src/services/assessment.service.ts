import axios from "axios";
import { logger } from "../config/logger";
import { Assessment } from "../models/assessment.model";
import {
    CreateAssessmentAIDto,
    CreateAssessmentDto,
} from "../types/assessment/assessment-create.dto";
import { UpdateAssessmentDto } from "../types/assessment/assessment-update.dto";
import { AppError } from "../utils/AppError";
import { companyService } from "./company.service";
import { jobService } from "./job.service";
import { AI_API_KEY } from "../config/dotenv";
import { CreateJobDTO } from "../types/job/job-create.dto";
import { getAiContent, getAiUpdatedContent } from "../utils/content.ai";
import { GetJobDTO } from "../types/job/job.dto";
import { GetAssessmentPublicDTO } from "../types/assessment/assessment.dto";

class AssessmentService {
    /**
     * Normalizes AI response by converting arrays to strings
     */
    private normalizeAIResponse(data: any): any {
        const normalized = { ...data };
        
        // Convert array fields to strings by joining with newlines
        const arrayFieldsToConvert = [
            'instructions',
            'constraints',
            'limitations',
            'evaluation',
            'problem_description',
            'allowedTechStack'
        ];
        
        arrayFieldsToConvert.forEach(field => {
            if (Array.isArray(normalized[field])) {
                normalized[field] = normalized[field]
                    .map((item: any) => String(item).trim())
                    .join('\n');
            }
        });
        
        return normalized;
    }
    private async generateAssessmentWithSarvam(
        instructionForAi: string,
        job: CreateJobDTO,
    ): Promise<CreateAssessmentAIDto> {
        try {
            const response = await axios.post(
                "https://api.sarvam.ai/v1/chat/completions",
                {
                    messages: [
                        {
                            content: getAiContent(job, instructionForAi),
                            role: "user",
                        },
                    ],
                    model: "sarvam-m",
                    max_tokens: 2000,
                },
                {
                    headers: {
                        "api-subscription-key": AI_API_KEY,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000,
                },
            );

            const rawContent = response.data?.choices?.[0]?.message?.content;
            if (!rawContent) {
                throw new Error("No content in Sarvam response");
            }

            let parsedData: CreateAssessmentAIDto;
            try {
                const rawParsed = JSON.parse(rawContent);
                parsedData = this.normalizeAIResponse(rawParsed);
            } catch (parseError) {
                logger.error(`Failed to parse AI response as JSON: ${parseError}`);
                throw new Error("AI returned invalid JSON");
            }

            if (
                !parsedData.title ||
                !parsedData.problem_description ||
                !parsedData.expectedDurationHours
            ) {
                throw new Error("AI response missing required fields");
            }

            return parsedData;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("STATUS:", error.response?.status);
                console.error("DATA:", JSON.stringify(error.response?.data, null, 2));
                console.error("HEADERS:", error.response?.headers);
            } else {
                console.error(error);
            }

            throw new AppError(
                "Sarvam AI request failed. Check logs for details.",
                400,
            );
        }
    }

    private async updateAssessmentWithSarvam(
        instructionForAi: string,
        job: GetJobDTO,
        existedAssessment: GetAssessmentPublicDTO
    ): Promise<UpdateAssessmentDto> {
        try {
            const response = await axios.post(
                "https://api.sarvam.ai/v1/chat/completions",
                {
                    messages: [
                        {
                            content: getAiUpdatedContent(job, instructionForAi, existedAssessment),
                            role: "user",
                        },
                    ],
                    model: "sarvam-m",
                    max_tokens: 2000,
                },
                {
                    headers: {
                        "api-subscription-key": AI_API_KEY,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000,
                },
            );

            const rawContent = response.data?.choices?.[0]?.message?.content;
            if (!rawContent) {
                throw new Error("No content in Sarvam response");
            }

            let parsedData: CreateAssessmentAIDto;
            try {
                const rawParsed = JSON.parse(rawContent);
                parsedData = this.normalizeAIResponse(rawParsed);
            } catch (parseError) {
                logger.error(`Failed to parse AI response as JSON: ${parseError}`);
                throw new Error("AI returned invalid JSON");
            }

            if (
                !parsedData.title ||
                !parsedData.problem_description ||
                !parsedData.expectedDurationHours
            ) {
                throw new Error("AI response missing required fields");
            }

            return parsedData;
        } catch (error) {
            logger.error(
                `Failed to call the sarvam ai and update the assessment: ${error}`,
            );
            console.error(
                `Failed to call the sarvam ai and update the assessment: ${error}`,
            );
            throw new AppError(
                `Failed to call the sarvam ai and update the assessment: ${error}`,
                400,
            );
        }
    }

    public async createAssessment(
        payload: CreateAssessmentDto,
        jobId: string,
        companyId: string,
    ) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(
                    `Cant create assessment if job does not exist in the first place`,
                );
                console.error(
                    `Cant create assessment if job does not exist in the first place`,
                );
                throw new AppError(
                    `Cant create assessment if job does not exist in the first place`,
                    401,
                );
            }

            const isAlreadyExist = await Assessment.findOne({
                title: payload.title.toLowerCase().trim(),
                jobId: jobId,
            });

            if (isAlreadyExist) {
                logger.error(`Already Exist try to update previous`);
                console.error(`Already Exist try to update previous`);
                throw new AppError(`Already Exist try to update previous`, 409);
            }

            const uniqueJobId = crypto.randomUUID().slice(-6);

            const assessment = await Assessment.create({
                ...payload,
                jobId: jobId,
                uniqueId: uniqueJobId,
                companyId: companyId,
                type: "manual"
            });

            return assessment;
        } catch (error: any) {
            logger.error(`Failed to create assessment service: ${error.message}`);
            console.error(`Failed to create assessment service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async createAssessmentByAi(
        jobId: string,
        companyId: string,
        instructionForAi: string,
    ) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(
                    `Cant create assessment if job does not exist in the first place`,
                );
                console.error(
                    `Cant create assessment if job does not exist in the first place`,
                );
                throw new AppError(
                    `Cant create assessment if job does not exist in the first place`,
                    401,
                );
            }

            const aiGeneratedData = await this.generateAssessmentWithSarvam(
                instructionForAi,
                exists,
            );

            const isAlreadyExist = await Assessment.findOne({
                title: aiGeneratedData.title.toLowerCase().trim(),
                jobId: jobId,
            });

            if (isAlreadyExist) {
                logger.error(`Assessment with similar title already exists`);
                console.error(`Assessment with similar title already exists`);
                throw new AppError(
                    `Assessment with similar title already exists. Try updating or use different title.`,
                    409,
                );
            }

            const uniqueJobId = crypto.randomUUID().slice(-6);

            const assessment = await Assessment.create({
                title: aiGeneratedData.title,
                problem_description: aiGeneratedData.problem_description,
                allowedTechStack: aiGeneratedData.allowedTechStack,
                instructions: aiGeneratedData.instructions,
                constraints: aiGeneratedData.constraints,
                expectedDurationHours: aiGeneratedData.expectedDurationHours,
                submissionDeadlineDays: aiGeneratedData.submissionDeadlineDays,
                submissionRequirements: aiGeneratedData.submissionRequirements,
                limitations: aiGeneratedData.limitations,
                evaluation: aiGeneratedData.evaluation,
                jobId: jobId,
                uniqueId: uniqueJobId,
                companyId: companyId,
                type: "ai"
            });

            return assessment;
        } catch (error: any) {
            logger.error(
                `Failed to create assessment by ai service: ${error.message}`,
            );
            console.error(
                `Failed to create assessment by ai service: ${error.message}`,
            );
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getAllAssessmentsByJob(jobId: string) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(
                    `Cant create assessment if job does not exist in the first place`,
                );
                console.error(
                    `Cant create assessment if job does not exist in the first place`,
                );
                throw new AppError(
                    `Cant create assessment if job does not exist in the first place`,
                    401,
                );
            }

            const assessments = await Assessment.find({
                jobId: jobId,
            });

            return assessments;
        } catch (error: any) {
            logger.error(
                `Failed to get all assessments by jobid service: ${error.message}`,
            );
            console.error(
                `Failed to get all assessments by jobid service ${error.message}`,
            );
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getAllAssessmentsByCompanyId(companyId: string) {
        try {
            const exists = await companyService.findById(companyId);

            if (!exists) {
                logger.error(
                    `Cant get assessment if company does not exist in the first place`,
                );
                console.error(
                    `Cant get assessment if company does not exist in the first place`,
                );
                throw new AppError(
                    `Cant get assessment if company does not exist in the first place`,
                    401,
                );
            }

            const assessments = await Assessment.find({
                companyId: companyId,
            });

            return assessments;
        } catch (error: any) {
            logger.error(
                `Failed to get all assessments by company service: ${error.message}`,
            );
            console.error(
                `Failed to get all assessments by company service ${error.message}`,
            );
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getSingleAssessment(assessmentId: string) {
        try {
            const assessment = await Assessment.findById(assessmentId);
            return assessment;
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
                uniqueId: assessmentUniqueId,
            });
            return assessment;
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
                throw new AppError(`Failed to get assessment by id`, 403);
            }

            if (String(assessment.companyId) !== companyId) {
                logger.error(`Company id and assessment id are not same`);
                console.error(`Company id and assessment id are not same`);
                throw new AppError(`Company id and assessment id are not same`, 402);
            }

            await Assessment.findByIdAndDelete(assessmentId);

            return "Assessment has been deleted";
        } catch (error: any) {
            logger.error(`Failed to delete assessments: ${error.message}`);
            console.error(`Failed to delete assessments: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async updateAssessment(
        assessmentId: string,
        companyId: string,
        payload: UpdateAssessmentDto,
    ) {
        try {
            const assessment = await this.getSingleAssessment(assessmentId);

            if (!assessment) {
                logger.error(`Failed to get assessment by id`);
                console.error(`Failed to get assessment by id`);
                throw new AppError(`Failed to get assessment by id`, 403);
            }

            if (String(assessment.companyId) !== companyId) {
                logger.error(`Company id and assessment id are not same`);
                console.error(`Company id and assessment id are not same`);
                throw new AppError(`Company id and assessment id are not same`, 402);
            }

            const assessmentUpdated = await Assessment.findByIdAndUpdate(
                assessmentId,
                {
                    ...payload,
                    type: "manual"
                },
                {
                    new: true,
                },
            );

            return assessmentUpdated;
        } catch (error: any) {
            logger.error(`Failed to update assessments: ${error.message}`);
            console.error(`Failed to update assessments: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async updateAssessmentByAi(
        assessmentId: string,
        companyId: string,
        instructionForAi: string
    ) {
        try {
            const assessment = await this.getSingleAssessment(assessmentId);

            if (!assessment) {
                logger.error(`Failed to get assessment by id`);
                console.error(`Failed to get assessment by id`);
                throw new AppError(`Failed to get assessment by id`, 403);
            }

            if (String(assessment.companyId) !== companyId) {
                logger.error(`Company id and assessment id are not same`);
                console.error(`Company id and assessment id are not same`);
                throw new AppError(`Company id and assessment id are not same`, 402);
            }

            const getJob = await jobService.getJob(assessment.jobId)

            if (!getJob) {
                logger.error(`Failed to get job by id`);
                console.error(`Failed to get job by id`);
                throw new AppError(`Failed to get job by id`, 403);
            }

            const aiGeneratedData = await this.updateAssessmentWithSarvam(instructionForAi, getJob, assessment)

            const assessmentUpdated = await Assessment.findByIdAndUpdate(
                assessmentId,
                {
                    title: aiGeneratedData.title,
                    problem_description: aiGeneratedData.problem_description,
                    allowedTechStack: aiGeneratedData.allowedTechStack,
                    instructions: aiGeneratedData.instructions,
                    constraints: aiGeneratedData.constraints,
                    expectedDurationHours: aiGeneratedData.expectedDurationHours,
                    submissionDeadlineDays: aiGeneratedData.submissionDeadlineDays,
                    submissionRequirements: aiGeneratedData.submissionRequirements,
                    limitations: aiGeneratedData.limitations,
                    evaluation: aiGeneratedData.evaluation,
                    type: "ai"
                },
                {
                    new: true,
                },
            );

            return assessmentUpdated;
        } catch (error: any) {
            logger.error(`Failed to update assessments by ai: ${error.message}`);
            console.error(`Failed to update assessments by ai: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async updateAssessmentStatus(
        assessmentId: string,
        companyId: string,
        status: string
    ) {
        try {
            const assessment = await this.getSingleAssessment(assessmentId);

            if (!assessment) {
                logger.error(`Failed to get assessment by id`);
                console.error(`Failed to get assessment by id`);
                throw new AppError(`Failed to get assessment by id`, 403);
            }

            if (String(assessment.companyId) !== companyId) {
                logger.error(`Company id and assessment id are not same`);
                console.error(`Company id and assessment id are not same`);
                throw new AppError(`Company id and assessment id are not same`, 402);
            }

            const assessmentUpdated = await Assessment.findByIdAndUpdate(
                assessmentId,
                { status: status },
                {
                    new: true,
                },
            );

            return assessmentUpdated;
        } catch (error: any) {
            logger.error(`Failed to update assessments status: ${error.message}`);
            console.error(`Failed to update assessments status: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    public async getDraftAssessments(
        jobId: string,
    ) {
        try {

            const assessments = await Assessment.find(
                {
                    jobId: jobId,
                    status: "darft"
                }
            );

            return {
                assessments: assessments,
                totalAssessments: assessments.length
            };
        } catch (error: any) {
            logger.error(`Failed to get all assessments status: ${error.message}`);
            console.error(`Failed to get all assessments status: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}

export const assessmentService = new AssessmentService();
