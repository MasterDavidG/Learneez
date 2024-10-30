import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stage, Layer, Line, Image } from 'react-konva';
import { FaPen, FaEraser, FaPlay, FaStop, FaFastForward } from 'react-icons/fa';
import useImage from 'use-image';
import './StudentPage.css'; // For custom styling

const DrawingCanvas = ({ currentPage, tool, penSize }) => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const canvasRef = useRef(null);

  // Drawing functions
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], width: penSize }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="drawing-canvas">
      <Stage ref={canvasRef} width={800} height={600} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <Layer>
          <Image image={currentPage} width={800} height={600} />
        </Layer>
        <Layer>
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.tool === 'pen' ? 'black' : 'white'}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={line.tool === 'pen' ? 'source-over' : 'destination-out'}
            />
          ))}
        </Layer>
      </Stage>
      <button onClick={() => saveDrawing(canvasRef)}>Save Drawing</button>
    </div>
  );
};

const StudentPage = () => {
  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [audio, setAudio] = useState(null);
  const [textbookPage] = useImage(`/images/page${pageIndex + 1}.svg`); // Assuming images are named in order

  useEffect(() => {
    axios.get('/api/pages').then(response => setPages(response.data));
    const audioFile = new Audio(`/audio/${pageIndex + 1}.mp3`);
    setAudio(audioFile);
  }, [pageIndex]);

  return (
    <div className="student-page">
      <DrawingCanvas currentPage={textbookPage} tool="pen" penSize={3} />
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next Page</button>
      <button onClick={() => audio && audio.play()}>Play Audio</button>
    </div>
  );
};

export default StudentPage;
