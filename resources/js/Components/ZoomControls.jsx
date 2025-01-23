import React, { useState } from "react";

const ZoomControls = () => {
    const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level is 100%

    const increaseZoom = () => {
        setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Cap zoom at 200%
    };

    const decreaseZoom = () => {
        setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Minimum zoom 50%
    };

    const resetZoom = () => {
        setZoomLevel(1); // Reset to 100%
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
                onClick={resetZoom}
                aria-label="Reset Zoom"
            >
                Reset
            </button>
            <button
                className="zoom-button"
                onClick={increaseZoom}
                aria-label="Increase Zoom"
            >
                +
            </button>
            <div className="zoom-level">Zoom: {(zoomLevel * 100).toFixed(0)}%</div>

            {/* Apply zoom dynamically */}
            <style>{`
                body {
                    transform: scale(${zoomLevel});
                    transform-origin: 0 0; /* Keep scaling consistent from top-left */
                }
            `}</style>
        </div>
    );
};

export default ZoomControls;
