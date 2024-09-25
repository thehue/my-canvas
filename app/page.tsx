"use client";
import styled from "styled-components";
import { MouseEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState({ x: 0, y: 0 });
  const [drawingSurfaceImageData, setDrawingSurfaceImageData] =
    useState<ImageData>();

  const windowToCanvas = (
    windowX: number,
    windowY: number,
    canvas: HTMLCanvasElement,
  ): { x: number; y: number } => {
    const borderBox = canvas.getBoundingClientRect();
    return {
      x: (windowX - borderBox.left) * (canvas.width / borderBox.width),
      y: (windowY - borderBox.top) * (canvas.height / borderBox.height),
    };
  };

  const saveDrawingSurface = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d")!;
    const drawingSurfaceImageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setDrawingSurfaceImageData(drawingSurfaceImageData);
  };

  const restoreDrawingSurface = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d")!;
    if (drawingSurfaceImageData) {
      context.putImageData(drawingSurfaceImageData, 0, 0);
    }
  };

  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>): void => {
    const location = windowToCanvas(
      e.clientX,
      e.clientY,
      e.target as HTMLCanvasElement,
    );

    e.preventDefault(); // prevent cursor change

    saveDrawingSurface();

    setMouseDown({
      x: location.x,
      y: location.y,
    });
    setIsDragging(true);
  };

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>): void => {
    const canvas = e.target as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;

    if (isDragging) {
      const { x, y } = windowToCanvas(
        e.clientX,
        e.clientY,
        e.target as HTMLCanvasElement,
      );

      restoreDrawingSurface();

      const width = Math.abs(x - mouseDown.x);
      const height = Math.abs(y - mouseDown.y);

      const startX = Math.min(x, mouseDown.x);
      const startY = Math.min(y, mouseDown.y);

      context.strokeRect(startX, startY, width, height);
    }
  };

  const onMouseUp = (): void => {
    setIsDragging(false);
  };

  const drawGrid = (context: CanvasRenderingContext2D): void => {
    context.save();

    const stepX = 10;
    const stepY = 10;
    const lineWidth = 0.5;

    context.strokeStyle = "lightgray";
    context.fillStyle = "#fff";
    context.lineWidth = lineWidth;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = stepX + lineWidth; i < context.canvas.width; i += stepX) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, context.canvas.height);
      context.stroke();
    }

    for (let i = stepY + lineWidth; i < context.canvas.height; i += stepY) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
    }

    context.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) return;

    drawGrid(context);
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      Canvas not supported in the browser.
    </Canvas>
  );
}

const Canvas = styled.canvas`
  background: #ffffff;
  cursor: pointer;
  margin-left: 10px;
  margin-top: 10px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;
