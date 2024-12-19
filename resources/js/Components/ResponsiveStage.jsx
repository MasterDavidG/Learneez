import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Circle } from 'react-konva';
import useImage from 'use-image';

const ResponsiveStage = ({ imageSrc, buttons, onStageClick, selectedTextbook }) => {
    const [image] = useImage(imageSrc);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const stageContainerRef = useRef(null);

    // Updated playAudio to rely on props
    const playAudio = (audioPath) => {
        if (!selectedTextbook || !audioPath) {
            console.error('Audio path or selected textbook is missing.');
            return;
        }
    
        // Ensure audioPath is just the filename
        const sanitizedAudioPath = audioPath.replace(/^.*[\\/]/, ''); // Remove any path parts if present
        const fullAudioPath = `/api/buttons/audio/${selectedTextbook}/${sanitizedAudioPath}`;
    
        console.log("Loading audio from:", fullAudioPath);
    
        const audio = new Audio(fullAudioPath);
        audio.play()
            .then(() => console.log('Playing audio:', fullAudioPath))
            .catch((error) => console.error('Error playing audio:', error));
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

        window.addEventListener('resize', resizeStage);
        resizeStage(); // Initial resize

        return () => window.removeEventListener('resize', resizeStage);
    }, [image]);

    return (
        <div ref={stageContainerRef} style={{ width: '100%', height: 'auto' }}>
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={onStageClick}
                style={{ border: '1px solid #ccc', margin: '0 auto' }}
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

                {/* Render buttons with audio functionality */}
                <Layer>
                    {buttons.map((button, index) => (
                        <Circle
                            key={index}
                            x={button.x}
                            y={button.y}
                            radius={15}
                            fill="blue"
                            onClick={() => playAudio(button.audio)} // Use playAudio
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default ResponsiveStage;
