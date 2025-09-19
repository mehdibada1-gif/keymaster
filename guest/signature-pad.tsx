'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type SignaturePadProps = {
  onBegin: () => void;
  onEnd: (signature: string) => void;
  className?: string;
};

export function SignaturePad({ onBegin, onEnd, className }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const ctx = canvas.getContext('2d');
        if(ctx){
            ctx.scale(ratio, ratio);
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = '#000';
      context.lineWidth = 2;
      context.lineCap = 'round';
    }

    return () => {
        window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  const getEventPosition = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    } else {
      return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const pos = getEventPosition(event.nativeEvent);
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      setIsDrawing(true);
      onBegin();
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    event.preventDefault();
    const pos = getEventPosition(event.nativeEvent);
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.closePath();
      setIsDrawing(false);
      if (canvasRef.current) {
        onEnd(canvasRef.current.toDataURL());
      }
    }
  };
  
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className={cn('w-full h-48 bg-muted rounded-md cursor-crosshair', className)}
    />
  );
}
