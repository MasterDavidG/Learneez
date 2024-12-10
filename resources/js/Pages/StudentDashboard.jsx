import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import '../../css/StudentDashboard.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StudentDashboard = ({ auth }) => {
    const [textbooks, setTextbooks] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedTextbook, setSelectedTextbook] = useState(null);
    const [homeworkPage, setHomeworkPage] = useState(null);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });
    const pagesSectionRef = useRef(null);

    useEffect(() => {
        axios.get('/api/textbooks')
            .then((response) => setTextbooks(response.data))
            .catch((error) => console.error('Error fetching textbooks:', error));

        axios.get('/api/student/homework-status')
            .then((response) => setHomeworkPage(response.data.page_id))
            .catch((error) => console.error('Error fetching homework status:', error));

        axios.get('/api/student/profile')
            .then((response) => setProfile(response.data))
            .catch((error) => console.error('Error fetching profile:', error));
    }, []);

    const handleTextbookChange = (textbookId) => {
        setSelectedTextbook(textbookId);
        setPages([]);

        axios.get(`/api/textbooks/${textbookId}/pages`)
            .then((response) => {
                setPages(response.data);

                setTimeout(() => {
                    pagesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            })
            .catch((error) => console.error('Error fetching pages:', error));
    };

    const handleMarkAsDone = (pageId) => {
        axios.post(`/api/student/page/${pageId}/mark-as-done`)
            .then(() => {
                alert('Page marked as done!');
                if (pageId === homeworkPage) setHomeworkPage(null);
            })
            .catch((error) => console.error('Error marking page as done:', error));
    };

    const handleRemoveTeacher = () => {
        if (window.confirm('Are you sure you want to remove your teacher?')) {
            axios.post('/api/student/remove-teacher')
                .then(() => {
                    alert('Teacher removed successfully!');
                    // Optionally reload the profile
                    axios.get('/api/student/profile')
                        .then((response) => setProfile(response.data));
                })
                .catch((error) => console.error('Error removing teacher:', error));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="student-dashboard">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {profile.name || 'Student'}!</h1>
                        <button
                            onClick={handleRemoveTeacher}
                            className="button remove-teacher"
                        >
                            Remove Teacher
                        </button>
                        <Link href="/student/submissions" className="button view-submissions">
                            View Submissions
                        </Link>
                    </div>
                </header>

                {/* Textbook Selection */}
                <section className="textbook-section">
                    <h2>Choose a Textbook</h2>
                    <div className="books-container">
                        {textbooks.map((textbook) => (
                            <div
                                key={textbook.id}
                                className={`book-item ${
                                    textbook.id === selectedTextbook ? 'selected' : ''
                                }`}
                                onClick={() => handleTextbookChange(textbook.id)}
                            >
                                {textbook.title}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pages Grid */}
                {selectedTextbook && (
                    <section ref={pagesSectionRef} className="pages-grid">
                        <h2>Pages</h2>
                        <div className="grid-container">
                            {pages.map((page) => (
                                <div
                                    className={`grid-item ${
                                        page.id === homeworkPage ? 'homework-page styled-homework' : ''
                                    }`}
                                    key={page.id}
                                >
                                    <Link
                                        href={`/student/page/${page.id}?textbookId=${selectedTextbook}`}
                                        className="page-number"
                                    >
                                        {page.page_number}
                                    </Link>
                                    {page.id === homeworkPage && (
                                        <button
                                            className="button done"
                                            onClick={() => handleMarkAsDone(page.id)}
                                        >
                                            Done
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default StudentDashboard;
