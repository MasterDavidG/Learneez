import { useState, useRef } from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import "../../css/DrawingCanvas.css";

const WritingCanvas = ({ currentPage, tool, penSize, onSave }) => {
  const [lines, setLines] = useState([]);
  const isWriting = useRef(false);
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    isWriting.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], width: penSize }]);
  };

  const handleMouseMove = (e) => {
    if (!isWriting.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isWriting.current = false;
  };

  return (
    <div className="writing-canvas">
      <Stage
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
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
      <button onClick={() => onSave(canvasRef.current.toDataURL())}>Save Task</button>
    </div>
  );
};

export default WritingCanvas;
