import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';

const ResponsiveStage = ({ imageSrc, buttons, onStageClick }) => {
    const [image] = useImage(imageSrc);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const stageContainerRef = useRef(null);

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
                    {buttons.map((button, index) => (
                        <React.Fragment key={index}>
                            <Rect
                                x={button.x - 15}
                                y={button.y - 15}
                                width={30}
                                height={30}
                                fill="blue"
                            />
                            <Text
                                x={button.x - 10}
                                y={button.y - 10}
                                text="▶"
                                fontSize={20}
                                fill="white"
                            />
                        </React.Fragment>
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default ResponsiveStage;
