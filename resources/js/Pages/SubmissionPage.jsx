import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SubmissionPreviewStage from '@/Components/SubmissionPreviewStage';

const SubmissionsPage = ({ auth, studentId, selectedTextbook, selectedPage }) => {
    const [submission, setSubmission] = useState(null);
    const [pageDetails, setPageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedPage && selectedTextbook) {
            fetchPageDetails();
            fetchSubmission();
        }
    }, [selectedPage, selectedTextbook]);

    /** Fetches page details **/
    const fetchPageDetails = async () => {
        try {
            const response = await axios.get(`/api/textbooks/${selectedTextbook}/pages/${selectedPage}`);
            setPageDetails(response.data);
        } catch (error) {
            console.error("Error fetching page details:", error);
            setError("Неуспешно зареждане на страницата.");
        }
    };

    /** Fetches submission for the selected page **/
    const fetchSubmission = async () => {
        if (!studentId || !selectedPage) return;

        try {
            const response = await axios.get(`/api/submissions?student_id=${studentId}&page_id=${selectedPage}`);
            setSubmission(response.data);
        } catch (error) {
            console.error("Error fetching submission:", error);
            setSubmission(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="submissions-container">
                <h2>Преглед на Предадената Страница</h2>

                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <p>Зареждане...</p>
                ) : (
                    <>
                        {/* Display Page Image */}
                        {pageDetails ? (
                            <div className="page-preview">
                                <h3>{pageDetails.title || `Страница ${pageDetails.page_number}`}</h3>
                                <img src={`/storage/pages/${pageDetails.image}`} alt="Учебна страница" />
                            </div>
                        ) : (
                            <p>Страницата не беше намерена.</p>
                        )}

                        {/* Display Submission */}
                        {submission ? (
                            <div className="submission-preview">
                                <h3>Предадено Решение</h3>
                                <SubmissionPreviewStage
                                    submissionId={submission.id}
                                    src={submission.drawing_url || `/storage/drawings/${submission.drawing}`}
                                />
                            </div>
                        ) : (
                            <p>Няма предадено решение за тази страница.</p>
                        )}
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default SubmissionsPage;
