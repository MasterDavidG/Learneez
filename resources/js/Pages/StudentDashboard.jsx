import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

const StudentDashboard = () => {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        axios.get('/api/pages')
            .then((response) => {
                setPages(response.data.pages);
            });
    }, []);

    return (
        <div>
            <h1>Choose Page</h1>
            <ul>
                {pages.map((page) => (
                    <li key={page.id}>
                        <Link href={`/student/page/${page.id}`}>{page.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentDashboard;
