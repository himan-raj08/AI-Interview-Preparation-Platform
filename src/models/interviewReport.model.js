const mongoose = require("mongoose");


// ======================================================
// Technical Question Schema
// ======================================================

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Technical question is required"],
        },

        intention: {
            type: String,
            required: [true, "Intention is required"],
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
        },
    },
    {
        _id: false,
    }
);


// ======================================================
// Behavioral Question Schema
// ======================================================

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Behavioral question is required"],
        },

        intention: {
            type: String,
            required: [true, "Intention is required"],
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
        },
    },
    {
        _id: false,
    }
);


// ======================================================
// Skill Gap Schema
// ======================================================

const skillGapSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: [true, "Skill is required"],
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Severity is required"],
        },
    },
    {
        _id: false,
    }
);


// ======================================================
// Preparation Plan Schema
// ======================================================

const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: [true, "Day is required"],
        },

        focus: {
            type: String,
            required: [true, "Focus is required"],
        },

        tasks: [
            {
                type: String,
                required: [true, "Task is required"],
            },
        ],
    },
    {
        _id: false,
    }
);


// ======================================================
// Interview Report Schema
// ======================================================

const interviewReportSchema = new mongoose.Schema(
    {
        // --------------------------------------------
        // User
        // --------------------------------------------

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },


        // --------------------------------------------
        // Job Information
        // --------------------------------------------

        title: {
            type: String,
        },

        jobDescription: {
            type: String,
            required: [true, "Job description is required"],
        },


        // --------------------------------------------
        // Candidate Information
        // --------------------------------------------

        resume: {
            type: String,
        },

        selfDescription: {
            type: String,
        },


        // --------------------------------------------
        // AI Match Score
        // --------------------------------------------

        matchScore: {
            type: Number,
            min: 0,
            max: 100,
        },


        // --------------------------------------------
        // Technical Questions
        // --------------------------------------------

        technicalQuestions: [
            technicalQuestionSchema
        ],


        // --------------------------------------------
        // Behavioral Questions
        // --------------------------------------------

        behavioralQuestions: [
            behavioralQuestionSchema
        ],


        // --------------------------------------------
        // Skill Gaps
        // --------------------------------------------

        skillGaps: [
            skillGapSchema
        ],


        // --------------------------------------------
        // Preparation Plan
        // --------------------------------------------

        preparationPlan: [
            preparationPlanSchema
        ],
    },

    {
        timestamps: true,
    }
);


// ======================================================
// Model
// ======================================================

const interviewReportModel = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);


module.exports = interviewReportModel;