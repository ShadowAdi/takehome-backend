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
You are a pragmatic and experienced engineering hiring manager.

Your goal is to design ONE realistic take-home assessment that matches:
- the job role,
- the experience level,
- and the recruiter’s explicit instructions.

You must balance realism, fairness, and signal quality.

---

JOB DETAILS:
${JSON.stringify(job, null, 2)}

RECRUITER INSTRUCTIONS (HIGH PRIORITY):
${instructionForAi || "None provided"}

---

=== CORE PRINCIPLES (NON-NEGOTIABLE) ===

1. Output ONLY valid JSON (no markdown, no comments, no explanations)
2. The assessment scope MUST be derived from:
   (a) Job role + job description
   (b) Experience level
   (c) Recruiter instructions
3. DO NOT default to either “too simple” or “over-engineered”
4. Complexity is allowed ONLY when the role or recruiter intent clearly justifies it
5. The task must be realistically achievable in the stated time by a competent candidate

---

=== SCOPE DECISION RULES (CRITICAL) ===

• If the role is **frontend** and recruiter says “practical”, “UI-focused”, or “simple”:
  → Limit scope to frontend UI work
  → Mock data or simple public APIs only
  → NO backend, NO real-time systems

• If the role is **full-stack**:
  → Backend MAY be included, but must be minimal and justified
  → Prefer simple REST APIs over infrastructure setup

• If the role is **backend / systems / ML / low-level**:
  → Advanced tasks (WebSockets, streaming, ML models, compilers, etc.) ARE allowed
  → ONLY if aligned with job description or recruiter intent

• If recruiter explicitly asks for advanced systems (e.g., WebRTC, sockets, ML, compilers):
  → You MAY design such an assessment
  → Scope must still match experience level and time limits

---

=== PRACTICAL ≠ BASIC ===

“Practical” means:
✅ Realistic product or system behavior
✅ Thoughtful trade-offs
✅ Clean structure and reasoning
✅ Good UX or API design
✅ Problem-solving under constraints

It does NOT mean:
❌ Always a todo / weather / calculator app
❌ Artificially simple tasks
❌ Feature dumping

---

=== TIME-BASED SCOPE GUIDELINES ===

For **3–5 hours**:
- One focused feature or workflow
- 2–4 core components or modules
- Mock data or simple API calls
- Basic state management
- No auth, no real-time, no infra

For **6–8 hours**:
- 2–3 related features
- Clear data flow
- Error/loading states
- Light backend or advanced logic ONLY if role demands it

Do NOT pad time. Candidates have other commitments.

---

=== FORBIDDEN BY DEFAULT (UNLESS JUSTIFIED) ===

❌ WebSockets / real-time systems  
❌ Multi-user coordination  
❌ Video streaming / 3D graphics  
❌ Enterprise-level architecture  

These become allowed ONLY if job or recruiter explicitly implies them.

---

=== AI USAGE POLICY ===

The constraints field MUST include:
"AI tools (ChatGPT, Copilot, etc.) may be used for syntax or boilerplate. Core logic and decisions must reflect the candidate’s own understanding."

---

=== JSON OUTPUT SCHEMA (STRICT) ===

{
  "title": "string (clear, specific, not intimidating)",
  "problem_description": "string (2–3 sentences: what to build and why it matters)",
  "allowedTechStack": "string (must align with job tech stack)",
  "instructions": "string (4–6 numbered, concrete steps)",
  "constraints": "string (scope limits + AI policy)",
  "expectedDurationHours": number,
  "submissionDeadlineDays": number,
  "submissionRequirements": {
    "githubUrl": { "required": true, "description": "Public repository with clean commits" },
    "deployedUrl": { "required": true, "description": "Live deployment if applicable" },
    "videoDemo": { "required": false, "description": "Optional 2-minute walkthrough", "platform": "Loom" },
    "documentation": { "required": true, "description": "Short README explaining approach and trade-offs" },
    "otherUrls": [],
    "additionalInfo": { "required": false, "placeholder": "What you would improve with more time", "maxLength": 200 }
  },
  "limitations": "string (explicitly state what is intentionally out of scope)",
  "evaluation": "string (concise criteria; max 5 points, semicolon-separated)"
}

---

REMEMBER:
Assessments can range from simple UI tasks to advanced system challenges,
but ONLY when justified by job role, experience level, or recruiter intent.

Practical > Impressive.
Fair > Flashy.
Signal > Scope.

Respond ONLY with the JSON object.
`,
                            role: "user"
                        }

                    ],
                    model: 'sarvam-m',
                    max_tokens: 2000,
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
                throw new Error('No content in Sarvam response');
            }

            console.log("raw content ", rawContent)

            // Parse and validate JSON
            let parsedData: CreateAssessmentAIDto;
            try {
                parsedData = JSON.parse(rawContent);
            } catch (parseError) {
                logger.error(`Failed to parse AI response as JSON: ${parseError}`);
                throw new Error('AI returned invalid JSON');
            }

            // Validate required fields
            if (!parsedData.title || !parsedData.problem_description || !parsedData.expectedDurationHours) {
                throw new Error('AI response missing required fields');
            }

            return parsedData;
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

            const aiGeneratedData = await this.generateAssessmentWithSarvam(instructionForAi, exists);

            const isAlreadyExist = await Assessment.findOne({
                title: aiGeneratedData.title.toLowerCase().trim(),
                jobId: jobId
            });

            if (isAlreadyExist) {
                logger.error(`Assessment with similar title already exists`);
                console.error(`Assessment with similar title already exists`);
                throw new AppError(`Assessment with similar title already exists. Try updating or use different title.`, 409);
            }

            const uniqueJobId = crypto.randomUUID().slice(-6);

            const assessment = await Assessment.create({
                title: aiGeneratedData.title,
                problemDescription: aiGeneratedData.problem_description,
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
                companyId: companyId
            });

            return assessment;
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
