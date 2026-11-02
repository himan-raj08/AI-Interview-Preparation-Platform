
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import { downloadInterviewReportPDF } from "../../../services/interview.api";
import "../../../services/style/interview.scss";

const Interview = () => {
    const { interviewId } = useParams();

    const { report, loading, getReportById } = useInterview();

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId, getReportById]);

    const handleDownloadPDF = async () => {
        try {
            const pdfBlob = await downloadInterviewReportPDF(interviewId);

            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `interview-report-${interviewId}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);

        } catch (error) {
            console.error("PDF Download Error:", error);
            alert("Failed to download PDF");
        }
    };

    if (loading) {
        return (
            <div className="report-loading">
                <div className="loader"></div>
                <h2>Loading Interview Report...</h2>
                <p>Please wait while we prepare your report.</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="report-loading">
                <h2>Interview Report Not Found</h2>
                <p>Please check the report ID and try again.</p>
            </div>
        );
    }

    return (
        <main className="interview-report">
            <div className="report-container">

                {/* HEADER */}
                <section className="report-header">
                    <div className="report-heading-content">
                        <span className="report-badge">
                            AI INTERVIEW REPORT
                        </span>

                        <h1>Interview Report</h1>

                        <p>
                            Your personalized interview preparation report
                            generated using AI.
                        </p>
                    </div>

                    <div className="score-card">
                        <span>Match Score</span>

                        <strong>
                            {report.matchScore ?? 0}%
                        </strong>

                        <div className="score-bar">
                            <div
                                className="score-progress"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, Number(report.matchScore) || 0)
                                    )}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </section>

                {/* PDF DOWNLOAD */}
                <section className="download-section">
                    <div>
                        <h2>Your report is ready!</h2>
                        <p>
                            Download your complete interview preparation report.
                        </p>
                    </div>

                    <button
                        className="download-btn"
                        onClick={handleDownloadPDF}
                    >
                        ↓ Download PDF
                    </button>
                </section>

                {/* TECHNICAL QUESTIONS */}
                <section className="report-section">
                    <div className="section-title">
                        <div className="section-icon">💻</div>
                        <div>
                            <h2>Technical Questions</h2>
                            <p>Technical questions based on your target role.</p>
                        </div>
                    </div>

                    <div className="question-list">
                        {report.technicalQuestions?.map((item, index) => (
                            <div className="question-card" key={index}>
                                <div className="question-number">
                                    {index + 1}
                                </div>

                                <div className="question-content">
                                    <h3>{item.question}</h3>

                                    <div className="info-block">
                                        <span>What interviewer wants</span>
                                        <p>{item.intention}</p>
                                    </div>

                                    <div className="answer-block">
                                        <span>Suggested Answer</span>
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BEHAVIORAL QUESTIONS */}
                <section className="report-section">
                    <div className="section-title">
                        <div className="section-icon">🧠</div>
                        <div>
                            <h2>Behavioral Questions</h2>
                            <p>Prepare for common interview situations.</p>
                        </div>
                    </div>

                    <div className="question-list">
                        {report.behavioralQuestions?.map((item, index) => (
                            <div className="question-card" key={index}>
                                <div className="question-number">
                                    {index + 1}
                                </div>

                                <div className="question-content">
                                    <h3>{item.question}</h3>

                                    <div className="info-block">
                                        <span>What interviewer wants</span>
                                        <p>{item.intention}</p>
                                    </div>

                                    <div className="answer-block">
                                        <span>Suggested Answer</span>
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SKILL GAPS */}
                <section className="report-section">
                    <div className="section-title">
                        <div className="section-icon">⚠️</div>
                        <div>
                            <h2>Skill Gaps</h2>
                            <p>Skills you should improve for this role.</p>
                        </div>
                    </div>

                    <div className="skill-grid">
                        {report.skillGaps?.map((item, index) => (
                            <div className="skill-card" key={index}>
                                <h3>{item.skill}</h3>

                                <span className={`severity ${item.severity?.toLowerCase()}`}>
                                    {item.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PREPARATION PLAN */}
                <section className="report-section">
                    <div className="section-title">
                        <div className="section-icon">📅</div>
                        <div>
                            <h2>Preparation Plan</h2>
                            <p>Your seven-day interview preparation roadmap.</p>
                        </div>
                    </div>

                    <div className="preparation-list">
                        {report.preparationPlan?.map((item, index) => (
                            <div className="day-card" key={index}>
                                <div className="day-number">
                                    Day {item.day}
                                </div>

                                <div className="day-content">
                                    <h3>{item.focus}</h3>

                                    <ul>
                                        {item.tasks?.map((task, i) => (
                                            <li key={i}>{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
};

export default Interview;

