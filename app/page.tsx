"use client";
import styles from "./page.module.css";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.font = "38pt Arial";
    context.fillStyle = "cornflowerblue";
    context.strokeStyle = "blue";

    context.fillText(
      "Hello Canvas",
      canvas.width / 2 - 150,
      canvas.height / 2 + 15
    );
    context.strokeText(
      "Hello Canvas",
      canvas.width / 2 - 150,
      canvas.height / 2 + 15
    );
  }, []);

  return (
    <canvas className={styles.canvas} width={600} height={300} ref={canvasRef}>
      Canvas not supported
    </canvas>
  );
}
