"use client";
import styles from "../page.module.css";
import { useEffect, useRef } from "react";

export default function Rect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");

    context.font = "24px Helvetica";
    context.fillStyle = "black";
    context.fillText("Click Anywhere to erase", 175, 200);

    context.lineJoin = "round";
    context.lineWidth = 30;
    context.strokeStyle = "goldenrod";
    context.strokeRect(75, 100, 200, 200);

    context.fillStyle = "rgba(0,0,255,0.5)";
    context.fillRect(325, 100, 200, 200);

    context.canvas.onmousedown = function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.common}
      width={600}
      height={400}
    />
  );
}
