
import React, { useState } from "react";
import "../../../services/style/home.scss";
import { useInterview } from "../hooks/useInterview";

const Home = () => {
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");

    const { generateReport, loading } = useInterview();

    const handleGenerate = async () => {
        if (!resume) {
            alert("Please upload your resume");
            return;
        }

        if (!jobDescription.trim()) {
            alert("Please enter job description");
            return;
        }

        if (!selfDescription.trim()) {
            alert("Please enter self description");
            return;
        }

        try {
            await generateReport({
                jobDescription,
                selfDescription,
                resumeFile: resume
            });
        } catch (error) {
            console.error("Failed to generate interview:", error);
        }
    };

    return (
        <main className="home">
            <div className="home-container">

                {/* Header */}
                <header className="home-header">
                    <div className="header-content">
                        <div className="badge">
                            <span className="badge-dot"></span>
                            AI POWERED CAREER ASSISTANT
                        </div>

                        <h1>
                            Prepare smarter.
                            <br />
                            <span>Interview better.</span>
                        </h1>

                        <p>
                            Get a personalized interview preparation report
                            based on your resume, skills and target job.
                        </p>
                    </div>
                </header>

                {/* Steps */}
                <div className="steps-section">
                    <div className="step-item">
                        <span className="step-number">01</span>
                        <div>
                            <strong>Job Details</strong>
                            <small>Add target role</small>
                        </div>
                    </div>

                    <div className="step-line"></div>

                    <div className="step-item">
                        <span className="step-number">02</span>
                        <div>
                            <strong>Your Resume</strong>
                            <small>Upload your PDF</small>
                        </div>
                    </div>

                    <div className="step-line"></div>

                    <div className="step-item">
                        <span className="step-number">03</span>
                        <div>
                            <strong>AI Report</strong>
                            <small>Get your analysis</small>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="form-grid">

                    {/* Left Card */}
                    <section className="form-card job-card">
                        <div className="card-heading">
                            <div className="card-icon blue-icon">▤</div>
                            <div>
                                <h2>Job Description</h2>
                                <p>
                                    Tell us about the position you are applying for.
                                </p>
                            </div>
                        </div>

                        <label htmlFor="jobDescription">
                            Job requirements
                        </label>

                        <textarea
                            id="jobDescription"
                            name="jobDescription"
                            placeholder={`Paste the complete job description here...

Example:

We are looking for a Backend Developer with experience in Node.js, Express, MongoDB and REST APIs...`}
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                        />

                        <div className="textarea-footer">
                            <span>Include skills and job requirements</span>
                            <span>{jobDescription.length} characters</span>
                        </div>

                        <div className="info-box">
                            <span>ⓘ</span>
                            <p>
                                A detailed job description helps AI identify
                                the skills required for your target role.
                            </p>
                        </div>
                    </section>

                    {/* Right Card */}
                    <section className="form-card candidate-card">

                        {/* Resume */}
                        <div className="card-heading">
                            <div className="card-icon green-icon">↑</div>
                            <div>
                                <h2>Your Resume</h2>
                                <p>Upload your latest resume.</p>
                            </div>
                        </div>

                        <label
                            htmlFor="resume"
                            className={`upload-box ${resume ? "uploaded" : ""}`}
                        >
                            <div className="upload-icon">
                                {resume ? "✓" : "↑"}
                            </div>

                            <strong>
                                {resume
                                    ? resume.name
                                    : "Upload your resume"}
                            </strong>

                            <span>
                                {resume
                                    ? "Resume selected successfully"
                                    : "Click to browse PDF file"}
                            </span>

                            <input
                                type="file"
                                id="resume"
                                name="resume"
                                accept=".pdf,application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (file && file.type === "application/pdf") {
                                        setResume(file);
                                    } else if (file) {
                                        alert("Please upload a PDF file");
                                        e.target.value = "";
                                    }
                                }}
                            />
                        </label>

                        {/* Self Description */}
                        <div className="self-description">
                            <div>
                                <div className="card-icon purple-icon">♙</div>
                                <div>
                                    <h2>About Yourself</h2>
                                    <p>Describe your skills and experience.</p>
                                </div>
                            </div>

                            <textarea
                                id="selfDescription"
                                name="selfDescription"
                                placeholder="Tell us about yourself, your technical skills, projects, experience and career goals..."
                                value={selfDescription}
                                onChange={(e) =>
                                    setSelfDescription(e.target.value)
                                }
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            type="button"
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            <span>
                                {loading
                                    ? "Generating your report..."
                                    : "Generate Interview Report"}
                            </span>

                            <span className="generate-arrow">→</span>
                        </button>

                        <p className="secure-text">
                            🔒 Your information is securely processed.
                        </p>
                    </section>
                </div>

                <footer className="home-footer">
                    <span>AI Interview Preparation</span>
                </footer>

            </div>
        </main>
    );
};

export default Home;

