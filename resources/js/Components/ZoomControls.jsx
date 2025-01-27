import React, { useState } from "react";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa"; // Import zoom icons

const ZoomControls = ({ onZoomChange }) => {
    const [zoomLevel, setZoomLevel] = useState(0.6); // Default zoom level: 60%

    const increaseZoom = () => {
        const newZoom = Math.min(zoomLevel + 0.1, 2); // Cap zoom at 200%
        setZoomLevel(newZoom);
        onZoomChange(newZoom);
    };

    const decreaseZoom = () => {
        const newZoom = Math.max(zoomLevel - 0.1, 0.3); // Minimum zoom at 30%
        setZoomLevel(newZoom);
        onZoomChange(newZoom);
    };

    const resetZoom = () => {
        setZoomLevel(1); // Reset to 100%
        onZoomChange(1);
    };

    return (
        <div className="zoom-controls">
            {/* Decrease Zoom */}
            <button
                className="zoom-button"
                onClick={decreaseZoom}
                aria-label="Decrease Zoom"
            >
                <FaSearchMinus size={36} />
            </button>

            {/* Display Current Zoom Level */}
            <div className="zoom-level" aria-label={`Zoom Level: ${(zoomLevel * 100).toFixed(0)}%`}>
                {(zoomLevel * 10).toFixed(0)}
            </div>

            {/* Increase Zoom */}
            <button
                className="zoom-button"
                onClick={increaseZoom}
                aria-label="Increase Zoom"
            >
                <FaSearchPlus size={36} />
            </button>
        </div>
    );
};

export default ZoomControls;
