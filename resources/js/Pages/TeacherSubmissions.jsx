import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/TeacherSubmissions.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SubmissionPreviewStage from '@/Components/SubmissionPreviewStage';

const TeacherSubmissions = ({ auth, studentId }) => {
    const [submissions, setSubmissions] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedTextbook, setSelectedTextbook] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (studentId) fetchSubmissions();
        fetchTextbooks();
    }, [studentId]);
    // Fetch pages when a textbook is selected
    useEffect(() => {
        const fetchPages = async () => {
            if (selectedTextbook) {
                try {
                    const response = await axios.get(`/api/textbooks/${selectedTextbook}/pages`);
                    setPages(response.data);
                } catch (error) {
                    console.error('Error fetching pages:', error);
                }
            }
        };
        fetchPages();
    }, [selectedTextbook]);

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get(`/api/submissions?student_id=${studentId}`);
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const fetchTextbooks = async () => {
        try {
            const response = await axios.get('/api/textbooks');
            setTextbooks(response.data);
        } catch (error) {
            console.error('Error fetching textbooks:', error);
        }
    };
    const fetchUserTextbooks = async () => {
        try {
            const response = await axios.get('/api/textbooks');
            setTextbooks(response.data);
        } catch (error) {
            console.error('Error fetching textbooks:', error);
        }
    };
    const handleAssignHomework = async () => {
        if (!selectedTextbook || !selectedPage) {
            alert('Please select both a textbook and a page to assign.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/teacher/assign-homework', {
                student_id: studentId,
                page_id: selectedPage,
            });
            alert('Homework assigned successfully!');
        } catch (error) {
            console.error('Error assigning homework:', error);
            alert('Failed to assign homework. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="teacher-container">
                {/* Assign Homework Section */}
                <div className="assign-section">
                    <h2>Задай Страница за Домашно</h2>
                    <div className="dropdown-container">
                        <select
                            onChange={(e) => setSelectedTextbook(e.target.value)}
                            value={selectedTextbook || ''}
                            className="dropdown"
                        >
                            <option value="">Изберете Учебник...</option>
                            {textbooks.map((textbook) => (
                                <option key={textbook.id} value={textbook.id}>
                                    {textbook.title}
                                </option>
                            ))}
                        </select>

                        {selectedTextbook && (
                            <select
                                onChange={(e) => setSelectedPage(e.target.value)}
                                value={selectedPage || ''}
                                className="dropdown"
                            >
                                <option value="">Изберете Страница...</option>
                                {pages.map((page) => (
                                    <option key={page.id} value={page.id}>
                                        {page.title || `Страница ${page.page_number}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <button onClick={handleAssignHomework} className="assign-btn" disabled={loading}>
                        {loading ? 'Assigning...' : 'Създай задание'}
                    </button>
                </div>

                {/* Submissions Section */}
                <div className="submissions-section">
                    <h2>Предадени Решения от Ученника</h2>
                    <div className="submissions-scroll">
                        {submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <div key={submission.id} className="submission-item">
                                    <SubmissionPreviewStage
                                        submissionId={submission.id}
                                        src={`/pages/${submission.textbook_id}/${submission.image}`}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No submissions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TeacherSubmissions;