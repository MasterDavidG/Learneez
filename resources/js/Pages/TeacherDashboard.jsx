import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../css/TeacherDashboard.css";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const TeacherDashboard = ({ auth }) => {
    const [students, setStudents] = useState([]);
    const [unassignedStudents, setUnassignedStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        // Fetch students assigned to the logged-in teacher
        axios.get('/api/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error('Error fetching students:', error));

        // Fetch unassigned students
        axios.get('/api/unassigned-students') // Adjust endpoint for unassigned students
            .then(response => setUnassignedStudents(response.data))
            .catch(error => console.error('Error fetching unassigned students:', error));
    }, []);

    const handleAdoptStudent = () => {
        if (!selectedStudent) {
            alert('Please select a student to adopt.');
            return;
        }

        axios.post('/api/teacher/adopt-student', { student_id: selectedStudent })
            .then(() => {
                alert('Student adopted successfully!');
                // Refresh the lists
                setSelectedStudent('');
                axios.get('/api/students').then(response => setStudents(response.data));
                axios.get('/api/unassigned-students').then(response => setUnassignedStudents(response.data));
            })
            .catch(error => console.error('Error adopting student:', error));
    };

    const handleSelectStudent = (studentId) => {
        window.location.href = `/teacher/submissions?student_id=${studentId}`;
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="teacher-dashboard">
                <header className="dashboard-header">
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                    <h1>Здравей Учител</h1>
                </header>

                <div className="student-selection-container">
                    <h2>Приемете нов Ученик</h2>
                    <div className="adopt-section">
                        <select
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            value={selectedStudent}
                            className="student-select"
                        >
                            <option value="">Изберете ученик...</option>
                            {unassignedStudents.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAdoptStudent} className="adopt-button">
                            Приеми
                        </button>
                    </div>
                </div>

                <div className="assigned-students-container">
                    <h2>Ученици на които сте учител</h2>
                    {students.length > 0 ? (
                        <ul className="student-list">
                            {students.map(student => (
                                <li
                                    key={student.id}
                                    className="student-item"
                                    onClick={() => handleSelectStudent(student.id)}
                                >
                                    {student.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-students">No students assigned yet.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TeacherDashboard;
