const pdfParse = require("pdf-parse");
const puppeteer = require("puppeteer");

const {
    generateInterviewReport
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");


// ======================================================
// Generate Interview Report
// ======================================================

async function generateInterviewReportController(req, res) {
    try {

        // --------------------------------------------
        // Check Resume
        // --------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                message: "Resume is required",
            });
        }


        // --------------------------------------------
        // Get form data
        // --------------------------------------------

        const {
            selfDescription,
            jobDescription,
        } = req.body;


        // --------------------------------------------
        // Validate form data
        // --------------------------------------------

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message:
                    "Self description and job description are required",
            });
        }


        // --------------------------------------------
        // PDF -> Text
        // --------------------------------------------

        const pdfData = await pdfParse(req.file.buffer);

        const resumeContent = pdfData.text;


        if (!resumeContent || !resumeContent.trim()) {
            return res.status(400).json({
                message: "Could not extract text from resume",
            });
        }


        // --------------------------------------------
        // Generate AI Report
        // --------------------------------------------

        const interviewReportByAI =
            await generateInterviewReport({
                resume: resumeContent,
                selfDescription,
                jobDescription,
            });


        // --------------------------------------------
        // Save report in MongoDB
        // --------------------------------------------

        const interviewReport =
            await interviewReportModel.create({

                user: req.user.id,

                resume: resumeContent,

                selfDescription,

                jobDescription,

                ...interviewReportByAI,
            });


        // --------------------------------------------
        // Response
        // --------------------------------------------

        return res.status(201).json({

            message:
                "Interview report generated successfully",

            interviewReport,
        });

    } catch (error) {

        console.error(
            "Generate Interview Report Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to generate interview report",

            error: error.message,
        });
    }
}



// ======================================================
// Get Interview Report By ID
// ======================================================

async function getInterviewReportById(req, res) {

    try {

        // IMPORTANT:
        // Route is /report/:interviewId
        const { interviewId } = req.params;


        const interviewReport =
            await interviewReportModel
                .findOne({
                    _id: interviewId,

                    // Only allow logged-in user
                    // to see their own report
                    user: req.user.id,
                })
                .select(
                    "-resume -selfDescription -jobDescription"
                );


        // --------------------------------------------
        // Report not found
        // --------------------------------------------

        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found",
            });
        }


        // --------------------------------------------
        // Success
        // --------------------------------------------

        return res.status(200).json({

            message:
                "Interview report found successfully",

            interviewReport,
        });

    } catch (error) {

        console.error(
            "Get Interview Report Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to fetch interview report",

            error: error.message,
        });
    }
}



// ======================================================
// Get All Interview Reports
// ======================================================

async function getAllInterviewReports(req, res) {

    try {

        const reports =
            await interviewReportModel
                .find({
                    user: req.user.id,
                })
                .select(
                    "-resume -selfDescription -jobDescription"
                )
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            reports,
        });

    } catch (error) {

        console.error(
            "Get All Interview Reports Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to fetch interview reports",
        });
    }
}

// ======================================================
// Generate Interview Report PDF
// ======================================================

async function generateInterviewReportPDF(req, res) {

    try {

        const { interviewId } = req.params;

        // --------------------------------------------
        // Find report
        // --------------------------------------------

        const interviewReport =
            await interviewReportModel.findOne({
                _id: interviewId,
                user: req.user.id,
            });

        if (!interviewReport) {

            return res.status(404).json({
                message: "Interview report not found",
            });
        }


        // --------------------------------------------
        // Launch Puppeteer
        // --------------------------------------------

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        });


        const page = await browser.newPage();


        // --------------------------------------------
        // Prepare data
        // --------------------------------------------

        const technicalQuestions =
            interviewReport.technicalQuestions || [];

        const behavioralQuestions =
            interviewReport.behavioralQuestions || [];

        const skillGaps =
            interviewReport.skillGaps || [];

        const preparationPlan =
            interviewReport.preparationPlan || [];


        // --------------------------------------------
        // HTML for PDF
        // --------------------------------------------

        const html = `

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                    line-height: 1.6;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 10px;
                }

                h2 {
                    margin-top: 35px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 8px;
                }

                h3 {
                    margin-bottom: 8px;
                }

                .score {
                    text-align: center;
                    font-size: 20px;
                    margin-bottom: 30px;
                }

                .question {
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                }

                .skill {
                    margin-bottom: 15px;
                }

                .day {
                    margin-bottom: 25px;
                }

                ul {
                    padding-left: 25px;
                }

            </style>

        </head>


        <body>


            <h1>
                ${interviewReport.title || "Interview Report"}
            </h1>


            <div class="score">

                Match Score:

                <strong>
                    ${interviewReport.matchScore ?? 0}%
                </strong>

            </div>


            <!-- Technical Questions -->

            <h2>
                Technical Questions
            </h2>


            ${technicalQuestions.map((item, index) => `

                <div class="question">

                    <h3>
                        ${index + 1}. ${item.question}
                    </h3>

                    <p>
                        <strong>
                            What interviewer wants:
                        </strong>

                        ${item.intention}
                    </p>

                    <p>
                        <strong>
                            Answer:
                        </strong>

                        ${item.answer}
                    </p>

                </div>

            `).join("")}



            <!-- Behavioral Questions -->

            <h2>
                Behavioral Questions
            </h2>


            ${behavioralQuestions.map((item, index) => `

                <div class="question">

                    <h3>
                        ${index + 1}. ${item.question}
                    </h3>

                    <p>
                        <strong>
                            What interviewer wants:
                        </strong>

                        ${item.intention}
                    </p>

                    <p>
                        <strong>
                            Answer:
                        </strong>

                        ${item.answer}
                    </p>

                </div>

            `).join("")}



            <!-- Skill Gaps -->

            <h2>
                Skill Gaps
            </h2>


            ${skillGaps.map((item) => `

                <div class="skill">

                    <h3>
                        ${item.skill}
                    </h3>

                    <p>
                        Severity:
                        ${item.severity}
                    </p>

                </div>

            `).join("")}



            <!-- Preparation Plan -->

            <h2>
                Preparation Plan
            </h2>


            ${preparationPlan.map((item) => `

                <div class="day">

                    <h3>
                        Day ${item.day}: ${item.focus}
                    </h3>

                    <ul>

                        ${(item.tasks || [])
                            .map(
                                task =>
                                    `<li>${task}</li>`
                            )
                            .join("")}

                    </ul>

                </div>

            `).join("")}


        </body>

        </html>

        `;


        // --------------------------------------------
        // Set HTML
        // --------------------------------------------

        await page.setContent(html, {
            waitUntil: "networkidle0",
        });


        // --------------------------------------------
        // Generate PDF
        // --------------------------------------------

        const pdf = await page.pdf({

            format: "A4",

            printBackground: true,

            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px",
            },

        });


        await browser.close();


        // --------------------------------------------
        // Send PDF
        // --------------------------------------------

        res.set({

            "Content-Type": "application/pdf",

            "Content-Disposition":
                `attachment; filename="interview-report-${interviewId}.pdf"`,

        });


        return res.send(pdf);


    } catch (error) {

        console.error(
            "Generate Interview Report PDF Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to generate interview report PDF",

            error: error.message,

        });

    }

}



// ======================================================
// Export
// ======================================================

module.exports = {

    generateInterviewReportController,

    getInterviewReportById,

    getAllInterviewReports,

    generateInterviewReportPDF
};