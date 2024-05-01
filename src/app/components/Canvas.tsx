import { useRef, useState, TouchEvent, MouseEvent, useEffect, useCallback } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { MdUndo, MdOutlineRedo } from "react-icons/md";


interface CanvasProps {
  width: number;
  height: number;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onClearCanvas: () => void;
  containerRef: React.RefObject<HTMLDivElement>; // Add this line
}

export default function Canvas({
  width,
  height,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  onClearCanvas,
  containerRef,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false); // Use useRef to avoid re-renders
  const lastPoint = useRef({ x: 0, y: 0 }); // Track the last point for smoother drawing


  // History for undo and redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  }, []);

  const saveToHistory = useCallback(() => {
    const ctx = getContext();
    if (ctx && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(dataUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [getContext, history, historyIndex]);

  const initializeBackground = useCallback(() => {
    const ctx = getContext();
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
    }
  }, [getContext, width, height]);

  useEffect(() => {
    initializeBackground();
    const ctx = getContext();
    if (ctx) {
      const dataUrl = canvasRef.current!.toDataURL(); // Capture the initial state
      setHistory([dataUrl]); // Initialize history with the blank canvas
      setHistoryIndex(0);
    }
  }, [initializeBackground, getContext]);

  const drawLine = useCallback((x1:number, y1:number, x2:number, y2:number) => {
    const ctx = getContext();
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [getContext, brushColor, brushSize]);



  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);

  const applyHistoryImage = useCallback(() => {
    const ctx = getContext();
    if (ctx) {
      const img = new Image();
      img.src = history[historyIndex];
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      };
    }
  }, [getContext, history, historyIndex, width, height]);

  useEffect(() => {
    applyHistoryImage();
  }, [historyIndex, applyHistoryImage]);

  const startDrawing = useCallback((x: number, y: number) => {
    drawing.current = true;
    lastPoint.current = { x, y };
  }, []);

  const continueDrawing = useCallback((x: number, y: number) => {
    if (drawing.current) {
      drawLine(lastPoint.current.x, lastPoint.current.y, x, y); // Draw from last point to current
      lastPoint.current = { x, y }; // Update last point
    }
  }, [drawLine]);

  const stopDrawing = useCallback(() => {
    saveToHistory();
    drawing.current = false;
  }, [saveToHistory]);

  const clearCanvas = useCallback(() => {
    onClearCanvas();
    initializeBackground();
    saveToHistory();
  }, [initializeBackground, onClearCanvas, saveToHistory]);

  const onMouseDown = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width; // scaling factor for width
    const scaleY = canvasRef.current!.height / rect.height; // scaling factor for height
    const x = (event.nativeEvent.offsetX * scaleX); // scale mouse coordinates after they have
    const y = (event.nativeEvent.offsetY * scaleY); // been adjusted to be relative to element
    startDrawing(x, y);
}, [startDrawing]);

const onMouseMove = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const x = (event.nativeEvent.offsetX * scaleX);
    const y = (event.nativeEvent.offsetY * scaleY);
    continueDrawing(x, y);
}, [continueDrawing]);

const onTouchStart = useCallback((event: TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    startDrawing(x, y);
}, [startDrawing]);

const onTouchMove = useCallback((event: TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    continueDrawing(x, y);
}, [continueDrawing]);

  return (
    <div className='flex flex-col items-center gap-3' ref={containerRef}>
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
        className={`rounded-xl border border-gray-200 lg:w-[420px] lg:h-[420px] w-[330px] h-[330px] touch-action-none`}
      />
      <div className='lg:p-0 p-3'>
        <div 
          className='
          flex 
          flex-row 
          items-center 
          justify-between 
          gap-3 
          text-sm 
          lg:p-1 
          lg:pl-6
          lg:pr-6 
          pt-1
          pb-1
          pl-6
          pr-6
          border 
          border-gray-100 
          rounded-full 
          lg:w-[420px]
          w-[330px]
          shadow
          text-gray-700
          '
        >
          <div className='flex flex-row gap-1 items-center'>
            <label htmlFor="brushColor">Color</label>
            <input
              type="color"
              id="brushColor"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              style={{ width: '20px', height: '24px', background: 'none', border: 'none !important', outline: 'none !important', borderRadius: '50%'}}
              className='text-sm'
            />
          </div>

          <div className='flex flex-row items-center gap-2 text-sm'>
            <label htmlFor="brushSize">Size</label>
            <Box sx={{ width: 70, display: "flex", alignItems: "center" }}>
              <Slider
                size="small"
                min={1}
                step={1}
                max={100}
                valueLabelDisplay="off"
                defaultValue={50}
                value={brushSize}
                aria-label=""
                onChange={(e, value) => setBrushSize(value as number)}
              />
            </Box>
          </div>
          <div className='flex flex-row gap-6'>
            <button className='' onClick={undo}>
              <MdUndo />
            </button>
            <button className='' onClick={redo}>
              <MdOutlineRedo />
            </button>
          </div>

          <button 
            className='hover:text-black transition-colors duration-100 ease-in-out '
            onClick={clearCanvas}
          >
            Clear
          </button>
          
        </div>
      </div>
    </div>
  );
}
