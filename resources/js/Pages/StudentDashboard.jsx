import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaUserTie, FaTrash } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import "../../css/StudentDashboard.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const StudentDashboard = ({ auth }) => {
    const [textbooks, setTextbooks] = useState([]);
    const [userTextbooks, setUserTextbooks] = useState([]);
    const [homeworkPages, setHomeworkPages] = useState({});
    const [teacherName, setTeacherName] = useState(null);
    const [showRemoveTeacher, setShowRemoveTeacher] = useState(false);

    const [pages, setPages] = useState([]);
    const [selectedTextbook, setSelectedTextbook] = useState(null);
    const [assignTextbookId, setAssignTextbookId] = useState(null);
    const [homeworkPage, setHomeworkPage] = useState(null);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });
    const pagesSectionRef = useRef(null);

    useEffect(() => {
        fetchTextbooks();
        fetchUserTextbooks();
        fetchProfile();
        fetchTeacher();
    }, []);
    const fetchTeacher = () => {
        axios
            .get("/student/teacher")
            .then((response) => {
                setTeacherName(response.data.teacher_name || null);
            })
            .catch((error) => {
                console.error("Error fetching teacher:", error);
                setTeacherName(null);
            });
    };

    const fetchTextbooks = () => {
        axios
            .get("/api/textbooks")
            .then((response) => setTextbooks(response.data))
            .catch((error) =>
                console.error("Error fetching textbooks:", error)
            );
    };
    const fetchUserTextbooks = () => {
        axios
            .get("/api/user/textbooks")
            .then((response) => setUserTextbooks(response.data))
            .catch((error) =>
                console.error("Error fetching textbooks:", error)
            );
    };
    const fetchHomeworkStatusForPages = async (pages) => {
        if (pages.length === 0) return;

        try {
            const responses = await Promise.all(
                pages.map((page) =>
                    axios.get(`/student/page/${page.id}/assignment-status`)
                )
            );

            const updatedHomeworkPages = pages.reduce((acc, page, index) => {
                const { hasAssignment, isDone } = responses[index].data;

                acc[page.id] = {
                    hasAssignment: hasAssignment,
                    isCompleted: isDone,
                };

                return acc;
            }, {});

            setHomeworkPages(updatedHomeworkPages);
        } catch (error) {
            console.error("Error fetching homework status for pages:", error);
        }
    };

    const fetchProfile = () => {
        axios
            .get("/api/student/profile")
            .then((response) => setProfile(response.data))
            .catch((error) => console.error("Error fetching profile:", error));
    };
    const handleTextbookChange = async (textbookId) => {
        setSelectedTextbook(textbookId);
        setPages([]);
        setHomeworkPages({}); // Reset homework status

        try {
            const response = await axios.get(
                `/api/textbooks/${textbookId}/pages`
            );
            setPages(response.data);
            fetchHomeworkStatusForPages(response.data); // Fetch homework status **after** setting pages

            // Smooth scroll **from current position**
            setTimeout(() => {
                const scrollAmount =
                    pagesSectionRef.current.getBoundingClientRect().top - 100; // Adjust offset
                window.scrollBy({ top: scrollAmount, behavior: "smooth" });
            }, 200); // Delay to allow DOM update
        } catch (error) {
            console.error("Error fetching pages:", error);
        }
    };

    const handleAssignTextbook = () => {
        if (!assignTextbookId) {
            alert("Please select a textbook.");
            return;
        }

        axios
            .post("/student/assign-textbook", { textbook_id: assignTextbookId })
            .then((response) => {
                alert(response.data.message);
                fetchUserTextbooks();
            })
            .catch((error) => {
                console.error("Error assigning textbook:", error);
                alert(
                    error.response?.data?.error || "Failed to assign textbook."
                );
            });
    };

    const handleRemoveTeacher = () => {
        if (window.confirm("Are you sure you want to remove your teacher?")) {
            axios
                .post("/api/student/remove-teacher")
                .then((response) => {
                    alert(response.data.message);
                    setTeacherName(null);
                    setShowRemoveTeacher(false);
                })
                .catch((error) =>
                    console.error("Error removing teacher:", error)
                );
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="student-dashboard">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Здравей {profile.name || "Student"}!</h1>

                        {/* Teacher Section - Inside Header Left */}
                        <div className="teacher">
                        <div
                            className="teacher-section"
                            onClick={() =>
                                teacherName &&
                                setShowRemoveTeacher(!showRemoveTeacher)
                            }
                        >
                            
                            <FaUserTie className="teacher-icon" />
                            <span className="teacher-name">
                                 { teacherName ? teacherName : "Няма учител"}
                            </span>
                            </div>
                            {/* Dropdown Remove Teacher Button (Only visible if a teacher exists) */}
                            {showRemoveTeacher && teacherName && (
                                <div className="teacher-dropdown show">
                                    <button
                                        onClick={handleRemoveTeacher}
                                        className="remove-teacher"
                                    >
                                        <FaTrash
                                            style={{ marginRight: "5px" }}
                                        />{" "}
                                        Премахни Учител
                                    </button>
                                </div>
                            )}

                            {/* Informational Message when No Teacher */}
                            {!teacherName && (
                                <div className="teacher-info">
                                    Учителят ви може да се регистрира в платформата и да ви помага в обучението. 
                                </div>
                            )}
                        </div>
                        {/* Dropdown to assign a textbook */}
                        <div className="assign-textbook-container">
                            <select
                                value={assignTextbookId || ""}
                                onChange={(e) =>
                                    setAssignTextbookId(e.target.value)
                                }
                                className="dropdown assign-textbook-dropdown"
                            >
                                <option value="">Избери нов Учебник</option>
                                {textbooks.map((textbook) => (
                                    <option
                                        key={textbook.id}
                                        value={textbook.id}
                                    >
                                        {textbook.title}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAssignTextbook}
                                className="button assign-textbook-button"
                            >
                                Запази учебник
                            </button>
                        </div>
                    </div>
                </header>

                {/* Textbook Selection */}
                <section className="textbook-section">
                    <h2>Избери Учебник</h2>
                    <div className="books-container">
                        {userTextbooks.map((userTextbook) => (
                            <div
                                key={userTextbook.id}
                                className={`book-item ${
                                    userTextbook.id === selectedTextbook
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleTextbookChange(userTextbook.id)
                                }
                            >
                                {userTextbook.title}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pages Grid */}
                {selectedTextbook && (
                    <section ref={pagesSectionRef} className="pages-grid">
                        <h2>Страница</h2>
                        <div className="grid-container">
                            {pages.map((page) => {
                                const homeworkStatus = homeworkPages[page.id];
                                const isHomework =
                                    homeworkStatus?.hasAssignment;
                                const isCompleted = homeworkStatus?.isCompleted;

                                return (
                                    <div
                                        className={`grid-item ${
                                            isHomework
                                                ? isCompleted
                                                    ? "homework-page completed-homework" // New class for completed homework
                                                    : "homework-page styled-homework" // Existing class for non-completed homework
                                                : ""
                                        }`}
                                        key={page.id}
                                        onClick={() =>
                                            (window.location.href = `/student/page/${page.id}?textbookId=${selectedTextbook}`)
                                        }
                                    >
                                        <span className="page-number">
                                            {page.page_number}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default StudentDashboard;
