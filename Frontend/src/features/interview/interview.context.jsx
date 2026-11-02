import { useState, createContext } from "react";
import { getAllinterviewReport } from "../../services/interview.api.js";

export const InterviewContext = createContext({});

export const InterviewProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    const getAllReports = async () => {

        try {
            setLoading(true);

            const response = await getAllinterviewReport();

            setReports(response.reports);

        } catch (error) {

            console.error(
                "Failed to fetch interview reports:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <InterviewContext.Provider
            value={{
                loading,
                setLoading,
                report,
                setReport,
                reports,
                setReports,
                getAllReports
            }}
        >
            {children}
        </InterviewContext.Provider>
    );
};