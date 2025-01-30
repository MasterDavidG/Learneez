import React, { useState, useEffect } from "react";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa"; // Import zoom icons

const ZoomControls = ({ zoomLevel, onZoomChange }) => {
    const [localZoom, setLocalZoom] = useState(zoomLevel); // Sync local state with prop

    // Sync zoom level when changed externally
    useEffect(() => {
        setLocalZoom(zoomLevel);
    }, [zoomLevel]);

    const increaseZoom = () => {
        const newZoom = Math.min(localZoom + 0.1, 2); // Cap at 200%
        setLocalZoom(newZoom);
        onZoomChange(newZoom);
    };

    const decreaseZoom = () => {
        const newZoom = Math.max(localZoom - 0.1, 0.3); // Minimum at 30%
        setLocalZoom(newZoom);
        onZoomChange(newZoom);
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
            <div className="zoom-level" aria-label={`Zoom Level: ${(localZoom * 100).toFixed(0)}%`}>
                {(localZoom * 10).toFixed(0)}
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
