import React, { useState } from "react";

const ZoomControls = ({ onZoomChange }) => {
    const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level: 100%

    const increaseZoom = () => {
        const newZoom = Math.min(zoomLevel + 0.1, 1,5); // Cap at 200%
        setZoomLevel(newZoom);
        onZoomChange(newZoom);
    };

    const decreaseZoom = () => {
        const newZoom = Math.max(zoomLevel - 0.1, 0.3); // Min at 50%
        setZoomLevel(newZoom);
        onZoomChange(newZoom);
    };

    const resetZoom = () => {
        setZoomLevel(1); // Reset to 100%
        onZoomChange(1);
    };

    return (
        <div className="zoom-controls">
            <button
                className="zoom-button"
                onClick={decreaseZoom}
                aria-label="Decrease Zoom"
            >
                -
            </button>
           
            <button
                className="zoom-button"
                onClick={increaseZoom}
                aria-label="Increase Zoom"
            >
                +
            </button>
            <div className="zoom-level">{(zoomLevel * 10).toFixed(0)}</div>
        </div>
    );
};

export default ZoomControls;
