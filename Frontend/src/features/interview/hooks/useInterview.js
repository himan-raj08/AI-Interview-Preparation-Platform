import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllinterviewReport,
    generateReportId,
    generateInterviewReport
} from "../../../services/interview.api";

import { InterviewContext } from "../interview.context";

export const useInterview = () => {

    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }

    const navigate = useNavigate();

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context;


    // Generate new interview report
    const generateReport = useCallback(async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true);

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            setReport(response.interviewReport);

            const interviewId = response.interviewReport._id;

            navigate(`/interview/${interviewId}`);

            return response;

        } catch (error) {

            console.error("Backend Error:", error.response?.data);
            console.error("Status:", error.response?.status);

            throw error;

        } finally {
            setLoading(false);
        }

    }, [setLoading, setReport, navigate]);


    // Get one report by ID
    const getReportById = useCallback(async (interviewId) => {

        setLoading(true);

        try {
            const response = await generateReportId(interviewId);

            setReport(response.interviewReport);

            return response;

        } catch (error) {

            console.error(
                "Failed to fetch interview report:",
                error
            );

            throw error;

        } finally {
            setLoading(false);
        }

    }, [setLoading, setReport]);


    // Get all reports
    const getReports = useCallback(async () => {

        setLoading(true);

        try {
            const response = await getAllinterviewReport();

            setReports(response.reports);

            return response;

        } catch (error) {

            console.error(
                "Failed to fetch interview reports:",
                error
            );

            throw error;

        } finally {
            setLoading(false);
        }

    }, [setLoading, setReports]);


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports
    };
};