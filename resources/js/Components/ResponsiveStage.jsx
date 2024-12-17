import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Rect, Text, Circle } from 'react-konva';
import useImage from 'use-image';

const ResponsiveStage = ({ imageSrc, buttons, onStageClick }) => {
    const [image] = useImage(imageSrc);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const stageContainerRef = useRef(null);

    const playAudio = (audioPath) => {
        const audio = new Audio(audioPath); // Use full URL returned from backend
        audio.play().catch((error) => console.error('Error playing audio:', error));
    };
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
                
                <Layer>
                    {image && (
                        <Image
                            image={image}
                            width={stageSize.width}
                            height={stageSize.height}
                        />
                    )}
                    
                </Layer>
                <Layer>
                    {buttons.map((button, index) => (
                        <Circle
                            key={index}
                            x={button.x}
                            y={button.y}
                            radius={15} // Visible size for audio button
                            fill="blue"
                            onClick={() => playAudio(button.audio)}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default ResponsiveStage;
