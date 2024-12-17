// SubmissionPreviewStage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useImage from 'use-image';
import { Image, Layer, Line, Stage } from 'react-konva';

const SubmissionPreviewStage = ({ submissionId, src }) => {
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [image] = useImage(src);
    const [submissionJSON, setSubmissionJSON] = useState([]);

    // Fetch submission drawing JSON
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/submission/${submissionId}`)
            .then((response) => {
                setSubmissionJSON(response.data);
            })
            .catch((error) => console.error('Error fetching submission JSON:', error));
    }, [submissionId]);

    // Adjust stage size based on the image dimensions
    useEffect(() => {
        if (image) {
            setStageSize({
                width: image.width,
                height: image.height,
            });
        }
    }, [image]);

    return (
        <Stage width={stageSize.width} height={stageSize.height}>
            <Layer>
                {image && <Image image={image} />}
            </Layer>
            <Layer>
                {submissionJSON.map((line, index) => (
                    <Line
                        key={index}
                        points={line.points}
                        stroke={line.tool === 'pen' ? 'black' : 'white'}
                        strokeWidth={line.width}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                            line.tool === 'pen' ? 'source-over' : 'destination-out'
                        }
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default SubmissionPreviewStage;
