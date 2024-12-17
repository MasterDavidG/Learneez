import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Image, Circle } from 'react-konva';
import { FaSave } from 'react-icons/fa';
import '../../css/StudentPage.css';

const DrawingCanvas = ({ 
    currentPage, 
    buttons, 
    tool, 
    penSize, 
    onSaveDrawing, 
    canvasSize 
}) => {
    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines((prevLines) => [...prevLines, { tool, points: [pos.x, pos.y], width: penSize }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            const lastLine = updatedLines[updatedLines.length - 1];
            lastLine.points = lastLine.points.concat([point.x, point.y]);
            return updatedLines;
        });
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const saveDrawing = () => {
        const drawingJSON = JSON.stringify(lines);
        onSaveDrawing(drawingJSON);
    };

    const playAudio = (audioPath) => {
        const audio = new Audio(audioPath);
        audio.play().catch((error) => console.error('Error playing audio:', error));
    };

    return (
        <div className="drawing-canvas">
            <Stage
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>{currentPage && <Image image={currentPage} />}</Layer>
                <Layer>
                    {buttons.map((button, index) => (
                        <Circle
                            key={index}
                            x={button.x}
                            y={button.y}
                            radius={15}
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
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'pen' ? 'source-over' : 'destination-out'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
            <button onClick={saveDrawing} className="icon-button">
                <FaSave /> Save
            </button>
        </div>
    );
};

export default DrawingCanvas;
