import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Image, Rect, Text, Group } from 'react-konva';
import axios from 'axios';

const DrawingCanvas = ({ currentPage, buttons, tool, penSize, onSaveDrawing, onSubmitDrawing, canvasSize, onUndo }) => {
    const [lines, setLines] = useState([]);
    const [hoveredButton, setHoveredButton] = useState(null);
    const isDrawing = useRef(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchSavedDrawing = async () => {
            try {
                const response = await axios.get(`/submissions/drawings/${currentPage.id}.json`);
                if (response.data) {
                    setLines(JSON.parse(response.data));
                }
            } catch (error) {
                console.error('Error fetching saved drawing:', error);
            }
        };

        if (currentPage) {
            fetchSavedDrawing();
        }
    }, [currentPage]);

    // Stop drawing if mouse is released anywhere on the window
    useEffect(() => {
        const handleMouseUpWindow = () => {
            isDrawing.current = false;
        };
        window.addEventListener('mouseup', handleMouseUpWindow);

        return () => {
            window.removeEventListener('mouseup', handleMouseUpWindow);
        };
    }, []);

    // Drawing handlers
    const handleMouseDown = (e) => {
        if (e.target.className === 'audio-button') return;
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y], width: tool === 'eraser' ? penSize * 2 : penSize }]);
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

    // Stop drawing if the mouse leaves the canvas
    const handleMouseLeave = () => {
        isDrawing.current = false;
    };

    const undoLastLine = () => {
        setLines(lines.slice(0, -1));
        if (onUndo) onUndo();
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
        const audio = new Audio(audioPath);
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
                onMouseLeave={handleMouseLeave}
            >
                <Layer>
                    {currentPage && <Image image={currentPage} />}
                </Layer>
                <Layer>
                    {buttons.map((button, index) => (
                        <Group
                            key={index}
                            onClick={() => playAudio(button.audio)}
                            onMouseEnter={() => setHoveredButton(index)}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            <Rect
                                x={button.x - 20}
                                y={button.y - 15}
                                width={40}
                                height={40}
                                fill={hoveredButton === index ? '#64B5F6' : '#5DADE2'}
                                stroke="#4682B4"
                                strokeWidth={3}
                                cornerRadius={12}
                            />
                            <Text
                                x={button.x - 9}
                                y={button.y - 8}
                                text="▶"
                                fontSize={24}
                                fontFamily="Arial"
                                fill="white"
                                shadowColor="black"
                                shadowBlur={3}
                            />
                        </Group>
                    ))}
                </Layer>
                <Layer>
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            points={line.points}
                            stroke={line.tool === 'pen' ? 'black' : 'white'}
                            strokeWidth={line.tool === 'pen' ? line.width : line.width * 1.5} // Make eraser wider
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
                    Save
                </button>
                {onSubmitDrawing && (
                    <button type="button" onClick={submitDrawing} className="special-button submit-button">
                        Submit
                    </button>
                )}
            </div>
            <div className="side-controls">
                <button type="button" onClick={undoLastLine} className="undo-button">
                    ↻
                </button>
            </div>
        </div>
    );
};

export default DrawingCanvas;
