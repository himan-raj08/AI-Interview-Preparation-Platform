const { GoogleGenAI, Type } = require("@google/genai");
const z = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// ZOD VALIDATION SCHEMA
// ======================================================

const interviewReportSchema = z.object({

    matchScore: z
        .number()
        .min(0)
        .max(100),

    technicalQuestions: z
        .array(
            z.object({
                question: z.string(),
                intention: z.string(),
                answer: z.string(),
            })
        )
        .min(5),

    behavioralQuestions: z
        .array(
            z.object({
                question: z.string(),
                intention: z.string(),
                answer: z.string(),
            })
        )
        .min(5),

    skillGaps: z
        .array(
            z.object({
                skill: z.string(),
                severity: z.enum([
                    "low",
                    "medium",
                    "high",
                ]),
            })
        ),

    preparationPlan: z
        .array(
            z.object({
                day: z.number(),
                focus: z.string(),
                tasks: z.array(z.string()),
            })
        )
        .length(7),
});


// ======================================================
// GEMINI RESPONSE SCHEMA
// ======================================================

const geminiSchema = {
    type: Type.OBJECT,

    properties: {

        matchScore: {
            type: Type.NUMBER,
            description: "Candidate match score from 0 to 100",
        },

        technicalQuestions: {
            type: Type.ARRAY,

            items: {
                type: Type.OBJECT,

                properties: {

                    question: {
                        type: Type.STRING,
                    },

                    intention: {
                        type: Type.STRING,
                    },

                    answer: {
                        type: Type.STRING,
                    },
                },

                required: [
                    "question",
                    "intention",
                    "answer",
                ],
            },
        },

        behavioralQuestions: {
            type: Type.ARRAY,

            items: {
                type: Type.OBJECT,

                properties: {

                    question: {
                        type: Type.STRING,
                    },

                    intention: {
                        type: Type.STRING,
                    },

                    answer: {
                        type: Type.STRING,
                    },
                },

                required: [
                    "question",
                    "intention",
                    "answer",
                ],
            },
        },

        skillGaps: {

            type: Type.ARRAY,

            items: {

                type: Type.OBJECT,

                properties: {

                    skill: {
                        type: Type.STRING,
                    },

                    severity: {
                        type: Type.STRING,

                        enum: [
                            "low",
                            "medium",
                            "high",
                        ],
                    },
                },

                required: [
                    "skill",
                    "severity",
                ],
            },
        },

        preparationPlan: {

            type: Type.ARRAY,

            items: {

                type: Type.OBJECT,

                properties: {

                    day: {
                        type: Type.NUMBER,
                    },

                    focus: {
                        type: Type.STRING,
                    },

                    tasks: {

                        type: Type.ARRAY,

                        items: {
                            type: Type.STRING,
                        },
                    },
                },

                required: [
                    "day",
                    "focus",
                    "tasks",
                ],
            },
        },
    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],
};


// ======================================================
// GENERATE INTERVIEW REPORT
// ======================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {

    try {

        const prompt = `
You are an expert technical interviewer and career coach.

Analyze the following candidate information.

================ RESUME ================
${resume}

================ SELF DESCRIPTION ================
${selfDescription}

================ JOB DESCRIPTION ================
${jobDescription}


Generate an interview preparation report.

IMPORTANT:

technicalQuestions:
- Generate at least 5 questions.
- Every item MUST be an object.
- Every object MUST contain:
  question
  intention
  answer

behavioralQuestions:
- Generate at least 5 questions.
- Every item MUST be an object.
- Every object MUST contain:
  question
  intention
  answer

skillGaps:
- Identify missing or weak skills.
- Every item MUST be an object.
- Every object MUST contain:
  skill
  severity
- severity MUST be exactly one of:
  low
  medium
  high

preparationPlan:
- Generate exactly 7 days.
- Every item MUST be an object.
- Every object MUST contain:
  day
  focus
  tasks
- tasks MUST be an array of strings.

Do NOT put question/intention/answer as separate array elements.

Do NOT put numbers like 2.1, 2.2, 2.3 inside technicalQuestions.

Do NOT return strings where objects are required.

Return only the requested JSON structure.
`;


        // ==================================================
        // GEMINI
        // ==================================================

        const response =
            await ai.models.generateContent({

                model: "gemini-3.1-flash-lite",

                contents: prompt,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema:
                        geminiSchema,
                },
            });


        // ==================================================
        // RAW RESPONSE
        // ==================================================

        console.log(
            "\n========== GEMINI RAW RESPONSE ==========\n"
        );

        console.log(response.text);

        console.log(
            "\n==========================================\n"
        );


        if (!response.text) {

            throw new Error(
                "Gemini returned empty response"
            );
        }


        // ==================================================
        // PARSE
        // ==================================================

        const report =
            JSON.parse(response.text);


        // ==================================================
        // ZOD VALIDATION
        // ==================================================

        const validatedReport =
            interviewReportSchema.parse(
                report
            );


        // ==================================================
        // SUCCESS
        // ==================================================

        console.log(
            "\n========== GENERATED REPORT ==========\n"
        );

        console.log(
            JSON.stringify(
                validatedReport,
                null,
                2
            )
        );

        console.log(
            "\n======================================\n"
        );


        return validatedReport;

    } catch (error) {

        console.error(
            "\n❌ Gemini API Error:"
        );

        console.error(error);

        throw error;
    }
}


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    generateInterviewReport,
};