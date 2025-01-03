import { useState, useEffect } from 'react';
import useImage from 'use-image';
import axios from 'axios';
import DrawingCanvas from '../Components/DrawingCanvas';
import { FaPen, FaEraser } from 'react-icons/fa';
import '../../css/StudentPage.css';

const StudentPage = ({ page }) => {
    const [tool, setTool] = useState('pen');
    const [penSize, setPenSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(page);
    const [imageUrl, setImageUrl] = useState(null);
    const [currentPageImage] = useImage(imageUrl || '');
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [buttons, setButtons] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (currentPage) {
            const constructedImageUrl = `/pages/${currentPage.textbook_id}/${currentPage.image}`;
            setImageUrl(constructedImageUrl);

            const img = new window.Image();
            img.src = constructedImageUrl;
            img.onload = () => setCanvasSize({ width: img.width, height: img.height });
        }

        const fetchButtons = async () => {
            try {
                const response = await axios.get(`/api/buttons/${currentPage.id}`);
                setButtons(response.data.buttons);
            } catch (error) {
                console.error('Error fetching buttons:', error);
            }
        };

        fetchButtons();
    }, [currentPage]);

    const handleSaveDrawing = async (drawingJSON) => {
        try {
            await axios.post('/student/drawing/save', {
                page_id: currentPage.id,
                drawing_json: drawingJSON
            });
            alert('Drawing saved successfully!');
            setIsSaved(true);
        } catch (error) {
            console.error('Error saving drawing:', error);
            alert('Error saving drawing.');
        }
    };

    const handleSubmitDrawing = async (drawingJSON) => {
        try {
            await axios.post('/student/drawing/submit', {
                page_id: currentPage.id,
                drawing_json: drawingJSON
            });
            alert('Drawing submitted successfully!');
        } catch (error) {
            console.error('Error submitting drawing:', error);
            alert('Error submitting drawing.');
        }
    };

    const handlePageChange = async (direction) => {
        try {
            const response = await axios.get(`/student/page/${currentPage.id}/${direction}`);
            setCurrentPage(response.data);
        } catch (error) {
            console.error(`Error fetching ${direction} page:`, error);
            alert(`No ${direction} page available.`);
        }
    };

    const handleMarkAsDone = async () => {
        try {
            await axios.post(`/student/page/${currentPage.id}/mark-as-done`);
            alert('Page marked as done!');
        } catch (error) {
            console.error('Error marking page as done:', error);
            alert('Failed to mark the page as done.');
        }
    };

    if (!imageUrl) {
        return <div>Loading page...</div>;
    }

    return (
        <div className="student-page">
            <h1>Page {currentPage.page_number}</h1>
            <div className="top-controls">
                <button className="button prev" onClick={() => handlePageChange('prev')}>Previous</button>
                <button className="button next" onClick={() => handlePageChange('next')}>Next</button>
                <button className="button done" onClick={handleMarkAsDone}>Mark as Done</button>
                <button className="back-button" onClick={() => (window.location.href = '/student')}>
                    Back to Dashboard
                </button>
            </div>
            <DrawingCanvas
                currentPage={currentPageImage}
                buttons={buttons}
                tool={tool}
                penSize={penSize}
                onSaveDrawing={handleSaveDrawing}
                onSubmitDrawing={isSaved ? handleSubmitDrawing : null}
                canvasSize={canvasSize}
            />
            <div className="side-controls">
                <button onClick={() => setTool('pen')} className="icon-button"><FaPen /></button>
                <button onClick={() => setTool('eraser')} className="icon-button"><FaEraser /></button>
            </div>
            
            <div className="side-controls-slider">
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={penSize}
                    onChange={(e) => setPenSize(Number(e.target.value))}
                    className="vertical-slider"
                />
            </div>
        </div>
    );
};

export default StudentPage;
