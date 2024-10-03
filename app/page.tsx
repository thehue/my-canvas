"use client";
import styled from "styled-components";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Point, Rect, RectPoint } from "@/app/src/types";
import {
  degreeToRadian,
  getBoundingRectVertices,
  getCenterOfBoundingRect,
  getRotatedBoundingRectVertices,
} from "@/app/src/utils";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState({ x: 0, y: 0 });
  const [drawingSurfaceImageData, setDrawingSurfaceImageData] =
    useState<ImageData>();
  const [isEditing, setIsEditing] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [cursor, setCursor] = useState<string>(
    !isEditing ? "crosshair" : "default",
  );
  const [draggingOffset, setDraggingOffset] = useState<null | {
    x: number;
    y: number;
  }>(null);
  const [activeRect, setActiveRect] = useState<Rect | null>(null);

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
    const { x, y } = windowToCanvas(
      e.clientX,
      e.clientY,
      e.target as HTMLCanvasElement,
    );

    e.preventDefault(); // 커서 변경 방지

    saveDrawingSurface();

    setMouseDown({
      x,
      y,
    });
    setIsDragging(true);

    if (isEditing) {
      const draggingRectIndex = Math.max(
        ...rects
          .filter((rect) => isPointInRect(x, y, rect))
          .map((rect) => rect.id),
      );

      const draggingRect = rects[draggingRectIndex];
      if (draggingRect) {
        setActiveRect(draggingRect);
      } else {
        setActiveRect(null);
      }

      rects.forEach((rect) => {
        if (isPointInRect(x, y, rect)) {
          // dragging 비율 계산
          const draggingOffsetX = x - rect.x;
          const draggingOffsetY = y - rect.y;
          setDraggingOffset({
            x: draggingOffsetX,
            y: draggingOffsetY,
          });
        }
      });
    }
  };

  const isPointInRect = (px: number, py: number, rect: Rect): boolean => {
    const { x, y, width, height } = rect;
    return px >= x && px <= x + width && py >= y && py <= y + height;
  };

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>): void => {
    const canvas = e.target as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;

    const { x, y } = windowToCanvas(
      e.clientX,
      e.clientY,
      e.target as HTMLCanvasElement,
    );

    if (isEditing) {
      const hoverRect = rects.some((rect) => isPointInRect(x, y, rect));
      setCursor(hoverRect ? "pointer" : "default");
    }

    if (isDragging && isEditing) {
      // 나중에 생성된 rect일 수록 위에 쌓여진 사각형이므로 그 사각형을 드래깅 해준다
      const draggingRectIndex = Math.max(
        ...rects
          .filter((rect) => isPointInRect(x, y, rect))
          .map((rect) => rect.id),
      );

      const draggingRect = rects[draggingRectIndex];
      if (!draggingOffset) return;

      const startX = x - draggingOffset.x;
      const startY = y - draggingOffset.y;

      rects.splice(draggingRectIndex, 1, {
        ...draggingRect,
        x: startX,
        y: startY,
      });

      context.clearRect(0, 0, canvas.width, canvas.height);
      // drawGrid(context);
      rects.forEach((rect) => {
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    }

    if (isDragging && !isEditing) {
      restoreDrawingSurface();

      const width = Math.abs(x - mouseDown.x);
      const height = Math.abs(y - mouseDown.y);
      if (width >= 10 && height >= 10) {
        const startX = Math.min(x, mouseDown.x);
        const startY = Math.min(y, mouseDown.y);

        context.strokeRect(startX, startY, width, height);
        setRect({
          x: startX,
          y: startY,
          width,
          height,
          id: rects.length,
          degree: 0,
        });
      }
    }
  };

  const onMouseUp = (): void => {
    if (!isEditing) {
      if (
        rect &&
        rects.findIndex((savedRect) => savedRect.id === rect.id) < 0
      ) {
        setRects([...rects, rect]);
      }
    }
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

  const menuItemList = [
    {
      label: "+90° Clockwise",
      onClick: () => {
        if (!activeRect) return;
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        const index = rects.findIndex((rect) => rect.id === activeRect.id);
        console.log(index);

        if (index >= 0) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          rects.splice(index, 1, {
            ...rects[index],
            degree: normalizeDegree(rects[index].degree + 90),
          });
          paintRects({ rects, context });
        }
      },
    },
    {
      label: "-90° Clockwise",
      onClick: () => {},
    },
  ];

  const paintRects = ({
    rects,
    context,
  }: {
    rects: Rect[];
    context: CanvasRenderingContext2D;
  }) => {
    rects.forEach((rect) => {
      drawRect({ context, rect });
    });
  };

  const drawRect = ({
    context,
    rect,
  }: {
    context: CanvasRenderingContext2D;
    rect: Rect;
  }): void => {
    const { x, y, width, height, degree } = rect;

    // 현재 캔버스 context를 저장
    context.save();

    // 사각형의 중점을 구하기
    const vertices = getBoundingRectVertices(rect);
    const center = getCenterOfBoundingRect(vertices);

    // 캔버스의 원점을 사각형의 중점으로 변경
    context.translate(center.x, center.y);
    context.rotate(degreeToRadian(degree));

    // 다시 원래 위치로 이동
    context.translate(-center.x, -center.y);
    context.strokeRect(x, y, width, height);
    context.restore();
  };

  const normalizeDegree = (degree: number): number => {
    return degree % 360;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) return;

    // drawGrid(context);
  }, []);

  useEffect(() => {
    console.log(rects);
  }, [rects]);

  return (
    <Editor>
      <Tool>
        <Label htmlFor={"edit"}>Edit</Label>
        <input
          type={"checkbox"}
          id={"edit"}
          checked={isEditing}
          onChange={() => setIsEditing(!isEditing)}
        />
      </Tool>
      <Canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        $cursor={cursor}
      >
        Canvas not supported in the browser.
      </Canvas>
      {activeRect && (
        <SubToolBar $x={activeRect.x} $y={activeRect.y}>
          <SubToolBarInner>
            <OptionButton>•••</OptionButton>
            <RotationOptions>
              {menuItemList.map((item) => (
                <Option key={item.label} onClick={item.onClick}>
                  {item.label}
                </Option>
              ))}
            </RotationOptions>
          </SubToolBarInner>
        </SubToolBar>
      )}
    </Editor>
  );
}

const Editor = styled.div`
  position: relative;
  width: 100%;
`;

const Tool = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const Label = styled.label`
  margin-right: 5px;
`;

export const Canvas = styled.canvas<{ $cursor?: string }>`
  background: #ffffff;
  margin-left: 10px;
  margin-top: 10px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  cursor: ${({ $cursor }) => $cursor};
`;

const SubToolBar = styled.div<{
  $x: number;
  $y: number;
}>`
  position: absolute;
  top: -20px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 1px 1px 5px darkgray;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  border-radius: 4px;
  width: 30px;
  height: 20px;
  transform: ${({ $x, $y }) => `translate(${$x}px, ${$y}px)`};
`;

const SubToolBarInner = styled.div`
  position: relative;
`;

const OptionButton = styled.button`
  background: none;
  border: none;
  &:hover {
    color: dodgerblue;
    cursor: pointer;
  }
`;

const RotationOptions = styled.ul`
  width: 100px;
  background: #ffffff;
  box-shadow: 1px 1px 5px darkgray;
  margin: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 10px 0 0;
  border-radius: 4px;
  position: absolute;
  top: 26px;
`;

const Option = styled.li`
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: dodgerblue;
  }
`;
