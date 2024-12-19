import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SubmissionPreviewStage from '@/Components/SubmissionPreviewStage';

const StudentSubmissions = ({ auth }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get('/api/submissions'); // Fetch submissions for logged-in student
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="submissions-container">
                <h1>Your Submissions</h1>
                {loading ? (
                    <p>Loading submissions...</p>
                ) : submissions.length > 0 ? (
                    <div className="submissions-list">
                        {submissions.map((submission) => (
                            <div key={submission.id} className="submission-item">
                                <p>Submission Date: {new Date(submission.created_at).toLocaleDateString()}</p>
                                <SubmissionPreviewStage
                                    submissionId={submission.id}
                                    src={`/storage/pages/${submission.textbook_id}/${submission.page_image}`}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No submissions found.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default StudentSubmissions;
