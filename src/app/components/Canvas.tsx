import { useRef, useState, TouchEvent, MouseEvent, useEffect } from 'react';

interface CanvasProps {
  width: number;
  height: number;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onClearCanvas: () => void;
}

export default function Canvas({
  width,
  height,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  onClearCanvas,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  };

  const initializeBackground = () => {
    const ctx = getContext();
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height); // Fill entire canvas with white
    }
  };

  useEffect(() => {
    initializeBackground(); // Initialize the canvas with a white background
  }, []); // Run once on mount

  const startDrawing = (x: number, y: number) => {
    setDrawing(true);
    const ctx = getContext();
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const continueDrawing = (x: number, y: number) => {
    if (!drawing) return;
    const ctx = getContext();
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    const ctx = getContext();
    if (ctx) {
      ctx.closePath();
    }
  };

  const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    startDrawing(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    continueDrawing(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const onTouchStart = (event: TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent default scrolling behavior
    const touch = event.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const onTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent default scrolling behavior
    const touch = event.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    continueDrawing(x, y);
  };

  return (
    <div className='flex flex-col gap-3'>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrawing}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrawing}
        className='rounded-xl border border-gray-200'
      />
      <div className='flex flex-row items-center gap-3 text-sm lg:p-0 p-4'>
        <div className='flex flex-row items-center'>
          <label htmlFor="brushColor">Brush Color:</label>
          <input
            type="color"
            id="brushColor"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            style={{ width: '25px', height: '30px', background: 'none', border: 'none !important', outline: 'none !important'}}
            className='text-sm'
          />
        </div>

        <div className='flex flex-row items-center gap-1 text-sm'>
          <label htmlFor="brushSize">Brush Size:</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </div>

        <button 
          className='bg-slate-400 text-white text-sm p-2 w-32 font-semibold rounded-full' 
          onClick={onClearCanvas}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
