import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Circle, Group, Rect, Text } from "react-konva";
import useImage from "use-image";

const ResponsiveStage = ({
    imageSrc,
    buttons,
    onStageClick,
    selectedTextbook,
    currentPage,
}) => {
    // Move useState inside the component
    const [temporaryButton, setTemporaryButton] = useState(null);
    const [playingAudio, setPlayingAudio] = useState(null); // Track the currently playing audio button index
    const audioRef = useRef(null); // Ref for the audio object

    const [image, status] = useImage(imageSrc);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const stageContainerRef = useRef(null);
    const [hoveredButton, setHoveredButton] = useState(null);

    useEffect(() => {
        if (status === "failed") {
            console.error("Failed to load image:", imageSrc);
            alert("Image failed to load. Please try again.");
        }
    }, [status, imageSrc]);

    // Updated playAudio to rely on props
    const toggleAudio = (audioPath, index) => {
        if (playingAudio === index) {
            // Stop the currently playing audio
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlayingAudio(null);
        } else {
            // Play a new audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            const audio = new Audio(audioPath);
            audioRef.current = audio;
            setPlayingAudio(index);
            audio
                .play()
                .catch((error) => console.error("Error playing audio:", error));

            // Reset state when audio ends
            audio.addEventListener("ended", () => setPlayingAudio(null));
        }
    };

    // Handle resizing the stage to match the image's aspect ratio
    useEffect(() => {
        const resizeStage = () => {
            if (stageContainerRef.current && image) {
                const containerWidth = stageContainerRef.current.offsetWidth;
                const aspectRatio = image.width / image.height;
                const containerHeight = containerWidth / aspectRatio;

                setStageSize({
                    width: image.width,
                    height: image.height,
                });
            }
        };

        window.addEventListener("resize", resizeStage);
        resizeStage(); // Initial resize

        return () => window.removeEventListener("resize", resizeStage);
    }, [image]);

    const handleStageClick = (e) => {
        const pos = e.target.getStage().getPointerPosition();
        onStageClick(e); // Call the passed `onStageClick` function
        setTemporaryButton({ x: pos.x, y: pos.y });
    };

    return (
        <div ref={stageContainerRef} style={{ width: "100%", height: "auto" }}>
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                style={{ border: "1px solid #ccc", margin: "0 auto" }}
            >
                {/* Render the background image */}
                <Layer>
                    {image && (
                        <Image
                            image={image}
                            width={stageSize.width}
                            height={stageSize.height}
                        />
                    )}
                </Layer>

                {/* Render buttons with toggle audio functionality */}
                <Layer>
                    {buttons.map((button, index) => (
                        <Group
                            key={index}
                            onClick={() => toggleAudio(button.audio, index)} // Works for mouse
                            onTap={() => toggleAudio(button.audio, index)} // Works for touchscreens
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
                                text={playingAudio === index ? "■" : "▶"} // Toggle text between stop and play
                                fontSize={24}
                                fontFamily="Arial"
                                fill="white"
                                shadowColor="black"
                                shadowBlur={3}
                            />
                        </Group>
                    ))}
                </Layer>

                {/* Render the temporary button marker */}
                <Layer>
                    {temporaryButton && (
                        <Circle
                            x={temporaryButton.x}
                            y={temporaryButton.y}
                            radius={10}
                            fill="green"
                            opacity={0.5}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
};

export default ResponsiveStage;
