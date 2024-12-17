import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image, Circle } from 'react-konva';
import useImage from 'use-image';
import axios from 'axios';
import { FaPen, FaEraser, FaSave } from 'react-icons/fa';
import '../../css/StudentPage.css';

const DrawingCanvas = ({ currentPage, buttons, tool, penSize, onSaveDrawing, onSubmitDrawing, canvasSize }) => {    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    const canvasRef = useRef(null);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y], width: penSize }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines([...lines]);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const saveDrawing = () => {
        const drawingJSON = JSON.stringify(lines);
        onSaveDrawing(drawingJSON);
    };

    const submitDrawing = () => {
        const drawingJSON = JSON.stringify(lines);
        onSubmitDrawing(drawingJSON);
    };

    const playAudio = (audioPath) => {
        const audio = new Audio(audioPath); // Use full URL returned from backend
        audio.play().catch((error) => console.error('Error playing audio:', error));
    };

    return (
        <div className="drawing-canvas">
            <Stage
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {currentPage && <Image image={currentPage} />}
                </Layer>
                <Layer>
                    {buttons.map((button, index) => (
                        <Circle
                            key={index}
                            x={button.x}
                            y={button.y}
                            radius={15} // Visible size for audio button
                            fill="blue"
                            onClick={() => playAudio(button.audio)}
                        />
                    ))}
                </Layer>
                <Layer>
                    {lines.map((line, index) => (
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
            <div className="drawing-buttons-container">
    <button type="button" onClick={saveDrawing} className="special-button save-button">
        <FaSave /> Save
    </button>
    {onSubmitDrawing && (
        <button type="button" onClick={submitDrawing} className="special-button submit-button">
            Submit
        </button>
    )}
</div>

               </div>
    );
};

const StudentPage = ({ page }) => {
    const [tool, setTool] = useState('pen');
    const [penSize, setPenSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(page);
    const [imageUrl, setImageUrl] = useState(null);
    const [currentPageImage] = useImage(imageUrl || '');
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [buttons, setButtons] = useState([]); // State for audio buttons
    const [isSaved, setIsSaved] = useState(false); // Track if saved
    useEffect(() => {
        if (currentPage) {
            const constructedImageUrl = `/pages/${currentPage.textbook_id}/${currentPage.image}`;
            setImageUrl(constructedImageUrl);

            const img = new window.Image();
            img.src = constructedImageUrl;
            img.onload = () => setCanvasSize({ width: img.width, height: img.height });
        }

        // Fetch audio buttons for the current page
        const fetchButtons = async () => {
            try {
                const response = await axios.get(`/api/buttons/${currentPage.id}`);
                setButtons(response.data.buttons); // Set fetched buttons
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
            setIsSaved(true); // Enable the submit button
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
                <button
                    className="back-button"
                    onClick={() => (window.location.href = '/student')}
                >
                    Back to Dashboard
                </button>
            </div>
            <DrawingCanvas
                currentPage={currentPageImage}
                buttons={buttons} // Pass buttons for audio playback
                tool={tool}
                penSize={penSize}
                onSaveDrawing={handleSaveDrawing}
                onSubmitDrawing={isSaved ? handleSubmitDrawing : null} // Enable submit only if saved
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
