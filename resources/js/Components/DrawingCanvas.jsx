import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Image, Rect, Text, Group } from "react-konva";
import axios from "axios";
import { FaSave, FaPaperPlane } from "react-icons/fa"; // Icons from react-icons
const DrawingCanvas = ({
    currentPage,
    buttons,
    tool,
    penSize,
    onSaveDrawing,
    onSubmitDrawing,
    canvasSize,
    onUndo,
    pageId,
}) => {
    const [lines, setLines] = useState([]);
    const [hoveredButton, setHoveredButton] = useState(null);
    const isDrawing = useRef(false);
    const canvasRef = useRef(null);

    // Load saved drawing from the server
    useEffect(() => {
        const fetchSavedDrawing = async () => {
            try {
                const response = await axios.get(
                    `/submissions/drawings/${pageId}`
                );
                if (response.data) {
                    setLines(response.data);
                }
            } catch (error) {
                console.error("Error fetching saved drawing:", error);
            }
        };

        if (currentPage) {
            fetchSavedDrawing();
        }
    }, [currentPage]);

    // Stop drawing if pointer is released anywhere on the window
    useEffect(() => {
        const handlePointerUpWindow = () => {
            isDrawing.current = false;
        };
        window.addEventListener("pointerup", handlePointerUpWindow);

        return () => {
            window.removeEventListener("pointerup", handlePointerUpWindow);
        };
    }, []);

    // Drawing handlers with pointer capture
    const handlePointerDown = (e) => {
        if (e.evt.button !== undefined && e.evt.button !== 0) return; // Only allow left mouse button
        if (e.target.className === "audio-button") return;

        e.target.setPointerCapture(e.pointerId);
        isDrawing.current = true;

        const pos = e.target.getStage().getPointerPosition();
        const lineWidth = tool === "eraser" ? penSize * 2 : penSize;

        setLines((prevLines) => [
            ...prevLines,
            { tool, points: [pos.x, pos.y], width: lineWidth },
        ]);
    };

    const handlePointerMove = (e) => {
        if (!isDrawing.current) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        setLines((prevLines) => {
            const lastLine = prevLines[prevLines.length - 1];
            if (!lastLine) return prevLines;

            const newPoints = lastLine.points.concat([point.x, point.y]);
            const updatedLines = [...prevLines];
            updatedLines[updatedLines.length - 1] = {
                ...lastLine,
                points: newPoints,
            };

            return updatedLines;
        });
    };

    const handlePointerUp = (e) => {
        isDrawing.current = false;
        e.target.releasePointerCapture(e.pointerId);
    };

    const handlePointerLeave = () => {
        isDrawing.current = false;
    };

    // Undo the last drawn line
    const undoLastLine = () => {
        setLines((prevLines) => prevLines.slice(0, -1));
        if (onUndo) onUndo();
    };

    // Save drawing
    const saveDrawing = () => {
        const drawingJSON = JSON.stringify(lines);
        onSaveDrawing(drawingJSON);
    };

    // Submit drawing
    const submitDrawing = () => {
        const drawingJSON = JSON.stringify(lines);
        onSubmitDrawing(drawingJSON);
    };

    // Play audio
    const playAudio = (audioPath) => {
        const audio = new Audio(audioPath);
        audio
            .play()
            .catch((error) => console.error("Error playing audio:", error));
    };

    return (
        <div className="drawing-canvas">
            <Stage
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
            >
                <Layer>{currentPage && <Image image={currentPage} />}</Layer>
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
                                fill={
                                    hoveredButton === index
                                        ? "#64B5F6"
                                        : "#5DADE2"
                                }
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
                            stroke={line.tool === "pen" ? "black" : "white"}
                            strokeWidth={line.width}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === "pen"
                                    ? "source-over"
                                    : "destination-out"
                            }
                        />
                    ))}
                </Layer>
            </Stage>
            <div className="drawing-buttons-container centered-buttons">
                    <button
                        type="button"
                        onClick={saveDrawing}
                        className="icon-button save-button"
                    >
                        <FaSave size={32} />
                    </button>

                {onSubmitDrawing && (
                    <button
                        type="button"
                        onClick={submitDrawing}
                        className="icon-button"
                    >
                        <FaPaperPlane size={24} />
                    </button>
                )}
            </div>
            <div className="side-controls">
                <button
                    type="button"
                    onClick={undoLastLine}
                    className="undo-button"
                >
                    ↶
                </button>
            </div>
        </div>
    );
};

export default DrawingCanvas;
