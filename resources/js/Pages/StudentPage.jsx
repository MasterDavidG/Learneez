import { useState, useEffect } from "react";
import useImage from "use-image";
import axios from "axios";
import DrawingCanvas from "../Components/DrawingCanvas";
import ZoomControls from "@/Components/ZoomControls"; // Import the ZoomControls
import { FaPen, FaEraser } from "react-icons/fa";
import "../../css/StudentPage.css";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaHome } from "react-icons/fa";

const StudentPage = ({ page }) => {
    const [tool, setTool] = useState("pen");
    const [penSize, setPenSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(page);
    const [imageUrl, setImageUrl] = useState(null);
    const [currentPageImage] = useImage(imageUrl || "");
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [buttons, setButtons] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [saveMessage, setSaveMessage] = useState(false); // New state for save message
    const [zoomLevel, setZoomLevel] = useState(1); // Zoom state

    // Handle zoom changes
    const handleZoomChange = (newZoom) => {
        setZoomLevel(newZoom);
    };

    useEffect(() => {
        if (currentPage) {
            const constructedImageUrl = `/pages/${currentPage.textbook_id}/${currentPage.image}`;
            setImageUrl(constructedImageUrl);

            const img = new window.Image();
            img.src = constructedImageUrl;
            img.onload = () =>
                setCanvasSize({ width: img.width, height: img.height });
        }

        const fetchButtons = async () => {
            try {
                const response = await axios.get(
                    `/api/buttons/${currentPage.id}`
                );
                setButtons(response.data.buttons);
            } catch (error) {
                console.error("Error fetching buttons:", error);
            }
        };

        fetchButtons();
    }, [currentPage]);

    const handleSaveDrawing = async (drawingJSON) => {
        try {
            await axios.post("/student/drawing/save", {
                page_id: currentPage.id,
                drawing_json: drawingJSON,
            });

            // Show the save message for a few seconds
            setSaveMessage(true);
            setTimeout(() => setSaveMessage(false), 3000);
            setIsSaved(true);
        } catch (error) {
            console.error("Error saving drawing:", error);
            alert("Error saving drawing.");
        }
    };

    const handleSubmitDrawing = async (drawingJSON) => {
        try {
            await axios.post("/student/drawing/submit", {
                page_id: currentPage.id,
                drawing_json: drawingJSON,
            });
            alert("Drawing submitted successfully!");
        } catch (error) {
            console.error("Error submitting drawing:", error);
            alert("Error submitting drawing.");
        }
    };

    const handlePageChange = async (direction) => {
        // Save the current drawing before navigating
        if (document.querySelector(".save-button")) {
            document.querySelector(".save-button").click();
        }

        try {
            const response = await axios.get(
                `/student/page/${currentPage.id}/${direction}`
            );
            setCurrentPage(response.data);
        } catch (error) {
            console.error(`Error fetching ${direction} page:`, error);
            alert(`No ${direction} page available.`);
        }
    };

    const handleMarkAsDone = async () => {
        try {
            await axios.post(`/student/page/${currentPage.id}/mark-as-done`);
            alert("Page marked as done!");
        } catch (error) {
            console.error("Error marking page as done:", error);
            alert("Failed to mark the page as done.");
        }
    };

    if (!imageUrl) {
        return <div>Loading page...</div>;
    }

    return (
        <div className="student-page">
            <div className="page-number">
                <span className="page-number-icon">📖</span>
                {currentPage.page_number}
            </div>

            {/* Zoom Controls */}
            <ZoomControls onZoomChange={handleZoomChange} />
            <div className="top-controls">
                    <button
                        className="icon-button"
                        onClick={() => handlePageChange("prev")}
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        className="icon-button"
                        onClick={() => handlePageChange("next")}
                    >
                        <FaArrowRight />
                    </button>
                    <button className="icon-button" onClick={handleMarkAsDone}>
                        <FaCheckCircle />
                    </button>
                    <button
                        className="icon-button"
                        onClick={() => {
                            if (document.querySelector(".save-button")) {
                                document.querySelector(".save-button").click();
                            }
                            window.location.href = "/student";
                        }}
                    >
                        <FaHome />
                    </button>
                </div>
            <div
                className="app-content"
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center top 0px", // Consistent scaling from the top-left
                }}
            >
               
<div className="drawing-test">
                {/* Drawing Canvas */}
                <DrawingCanvas
                    currentPage={currentPageImage}
                    buttons={buttons}
                    tool={tool}
                    penSize={penSize}
                    onSaveDrawing={handleSaveDrawing}
                    onSubmitDrawing={isSaved ? handleSubmitDrawing : null}
                    canvasSize={canvasSize}
                    pageId={currentPage.id}
                />
                </div>
            </div>

            {/* Side Controls */}
            <div className="side-controls">
                <button onClick={() => setTool("pen")} className="icon-button">
                    <FaPen />
                </button>
                <button
                    onClick={() => setTool("eraser")}
                    className="icon-button"
                >
                    <FaEraser />
                </button>
            </div>

            {/* Slider Control */}
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

            {/* Save Message */}
            {saveMessage && (
                <div className="save-message">✨ Your drawing is saved! Great job! 🎨</div>
            )}
        </div>
    );
};

export default StudentPage;
