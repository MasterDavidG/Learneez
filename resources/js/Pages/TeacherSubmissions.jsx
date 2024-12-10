import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/TeacherSubmissions.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useImage from 'use-image';
import { Image, Layer, Line, Stage } from 'react-konva';

const SubmissionPreviewStage = ({ submissionId, src }) => {
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [image] = useImage(src);
    const [ submissionJSON, setSubmissionJSON ] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/submission/${submissionId}`).then((response) => {
            setSubmissionJSON(response.data)
            console.log(response.data)
        })
    }, [])

    useEffect(() => {
        if (image)
            setStageSize({
                width: image.width,
                height: image.height,
            });
    }, [image])
    return (
        <Stage
            width={stageSize.width}
            height={stageSize.height}
        >
            <Layer>
                {image && <Image image={image} />}
            </Layer>
            <Layer>
                {submissionJSON.map((line, index) => (
                    <Line
                        key={index}
                        points={line.points}
                        stroke={line.tool === 'pen' ? 'black' : 'white'}
                        strokeWidth={line.width}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={line.tool === 'pen' ? 'source-over' : 'destination-out'}
                    />
                ))}
            </Layer>
        </Stage>
    )
 };

const TeacherSubmissions = ({ auth, studentId }) => {
    const [submissions, setSubmissions] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedTextbook, setSelectedTextbook] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Submissions and Textbooks
    useEffect(() => {
        if (studentId) {
            fetchSubmissions();
        }

        fetchTextbooks();
    }, [studentId]);

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

    const handleTextbookChange = async (textbookId) => {
        setSelectedTextbook(textbookId);
        setSelectedPage(null);

        try {
            const response = await axios.get(`/api/textbooks/${textbookId}/pages`);
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
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
            setLoading(false);
        } catch (error) {
            console.error('Error assigning homework:', error);
            alert('Failed to assign homework. Please try again.');
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="teacher-submissions-container">
                <header className="dashboard-header">
                    <h1>Submissions for Student {studentId}</h1>
                </header>

                <div className="content-container">
                    {/* Submissions Section */}
                    <div className="submissions-section">
                        <h2>Student Submissions</h2>
                        {submissions.length > 0 ? (
                            submissions.map((submission, i) => (
                                <div className="submission-card" key={i}>
                                    <h3>Page ID: {submission.page_id}</h3>
                                    {(submission.textbook_id && submission.image) ? (
                                        <SubmissionPreviewStage submissionId={submission.id} src={`/pages/${submission.textbook_id}/${submission.image}`}>
                                        </SubmissionPreviewStage>
                                    ) : (
                                        <p>Drawing not available</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-submissions">No submissions found.</p>
                        )}
                    </div>

                    {/* Homework Assignment Section */}
                    <div className="assignment-section">
                        <h2>Assign Homework</h2>
                        <div className="dropdowns">
                            <select
                                onChange={(e) => handleTextbookChange(e.target.value)}
                                value={selectedTextbook || ''}
                                className="dropdown"
                            >
                                <option value="">Select a textbook...</option>
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
                                    <option value="">Select a page...</option>
                                    {pages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            {page.title || `Page ${page.page_number}`}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <button
                            onClick={handleAssignHomework}
                            className="assign-button"
                            disabled={loading}
                        >
                            {loading ? 'Assigning...' : 'Assign as Homework'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TeacherSubmissions;
