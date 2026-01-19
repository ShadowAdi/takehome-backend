import axios from "axios";
import { logger } from "../config/logger";
import { Assessment } from "../models/assessment.model";
import { CreateAssessmentDto } from "../types/assessment/assessment-create.dto";
import { UpdateAssessmentDto } from "../types/assessment/assessment-update.dto";
import { AppError } from "../utils/AppError";
import { companyService } from "./company.service";
import { jobService } from "./job.service";
import { AI_API_KEY } from "../config/dotenv";

class AssessmentService {
    private async generateSummaryWithSarvam(articleUrl: string): Promise<any> {
        try {
            const response = await axios.post(
                'https://api.sarvam.ai/v1/chat/completions',
                {
                    messages: [
                        {
                            content: `Read the news from this URL and provide a response in JSON format with title and content.

              CRITICAL RULES:
              1. Use the SAME language as the original article (Gujarati/Hindi/English/etc) - DO NOT translate
              2. Write naturally like a journalist - NO phrases like "this article", "the news discusses", "according to"
              3. Start directly with facts - mention key people, events, numbers, and outcomes
              4. Be informative and engaging - write as if for a news app reader
              5. Cover: WHO did WHAT, WHEN, WHERE, and WHY/HOW
              6. Content should be strictly 60 words
              7. Title should be concise and meaningful

              URL: ${articleUrl}

              Respond ONLY with JSON in this exact format:
              {
                "title": "Your meaningful title here",
                "content": "Your 60-word summary here"
              }`,
                            role: 'user',
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

            let jsonContent = rawContent.trim();

            if (jsonContent.startsWith('```json')) {
                jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (jsonContent.startsWith('```')) {
                jsonContent = jsonContent.replace(/```\n?/g, '');
            }

            const parsed = JSON.parse(jsonContent.trim());

            if (!parsed.title || !parsed.content) {
                throw new Error('Invalid JSON structure: missing title or content');
            }

            return {
                title: parsed.title,
                content: parsed.content,
            };
        } catch (error) {
            logger.error(`Failed to call the sarvam ai: ${error}`)
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

    public async createAssessmentByAi(jobId: string, companyId: string) {
        try {
            const exists = await jobService.getJob(jobId);

            if (!exists) {
                logger.error(`Cant create assessment if job does not exist in the first place`)
                console.error(`Cant create assessment if job does not exist in the first place`)
                throw new AppError(`Cant create assessment if job does not exist in the first place`, 401)
            }

            console.log("job ", exists)


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
