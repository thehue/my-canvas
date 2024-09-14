"use client";
import styles from "./page.module.css";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas3Ref = useRef<HTMLCanvasElement | null>(null);

  const canvasHandler = (canvasElement: HTMLCanvasElement | null) => {
    const canvas = canvasElement;
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
  };

  useEffect(() => {
    canvasHandler(canvasRef.current);
    canvasHandler(canvas2Ref.current);
    canvasHandler(canvas3Ref.current);
  }, []);

  return (
    <>
      <h3>
        Canvas Element Size: 600 x 300, Canvas Drawing Surface Size: 600 x 300
      </h3>
      <canvas
        className={styles.common}
        width={600}
        height={300}
        ref={canvasRef}
      >
        Canvas not supported
      </canvas>
      <h3>
        Canvas Element Size: 300 x 150, Canvas Drawing Surface Size: 300 x 150
      </h3>
      <canvas className={styles.common} ref={canvas2Ref}>
        Canvas not supported
      </canvas>
      <h3>
        Canvas Element Size: 600 x 300, Canvas Drawing Surface Size: 300 x 150
      </h3>
      <canvas className={`${styles.common} ${styles.canvas2}`} ref={canvas3Ref}>
        Canvas not supported
      </canvas>
    </>
  );
}
