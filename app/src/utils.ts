import { Point, Rect, RectPoint } from "@/app/src/types";

// 사각형 중점 구하기
export const getCenterOfBoundingRect = ({
  topLeft,
  bottomRight,
}: {
  topLeft: Point;
  bottomRight: Point;
}): Point => {
  const x = Math.round((bottomRight.x + topLeft.x) / 2);
  const y = Math.round((bottomRight.y + topLeft.y) / 2);

  return { x, y };
};

// 회전변환 행렬
const getRotatedPoint = ({
  point,
  degree,
}: {
  point: Point;
  degree: number;
}): Point => {
  const { x, y } = point;
  const radian = degreeToRadian(degree);

  return {
    x: x * Math.cos(radian) - y * Math.sin(radian),
    y: x * Math.sin(radian) + y * Math.cos(radian),
  };
};

export const degreeToRadian = (degree: number): number =>
  degree * (Math.PI / 180);

export const getRotatedBoundingRectVertices = ({
  vertices,
  degree,
}: {
  vertices: RectPoint;
  degree: number;
}): RectPoint => {
  const { topLeft, topRight, bottomLeft, bottomRight } = vertices;
  const center = getCenterOfBoundingRect({ topLeft, bottomRight });
  // 사각형의 중점을 원점으로 이동
  const shiftedToOrigin = {
    topLeft: { x: topLeft.x - center.x, y: topLeft.y - center.y },
    topRight: { x: topRight.x - center.x, y: topRight.y - center.y },
    bottomLeft: { x: bottomLeft.x - center.x, y: bottomLeft.y - center.y },
    bottomRight: { x: bottomRight.x - center.x, y: bottomRight.y - center.y },
  };

  // 변환행렬 적용
  const rotated = {
    topLeft: getRotatedPoint({ point: shiftedToOrigin.topLeft, degree }),
    topRight: getRotatedPoint({ point: shiftedToOrigin.topRight, degree }),
    bottomLeft: getRotatedPoint({ point: shiftedToOrigin.bottomLeft, degree }),
    bottomRight: getRotatedPoint({
      point: shiftedToOrigin.bottomRight,
      degree,
    }),
  };

  // 원래 위치로 이동
  const shiftedBack = {
    topLeft: {
      x: rotated.topLeft.x + center.x,
      y: rotated.topLeft.y + center.y,
    },
    topRight: { x: rotated.topRight.x + center.x, y: rotated.topRight.y },
    bottomLeft: { x: rotated.bottomLeft.x + center.x, y: rotated.bottomLeft.y },
    bottomRight: {
      x: rotated.bottomRight.x + center.x,
      y: rotated.bottomRight.y,
    },
  };

  return shiftedBack;
};

export const getBoundingRectVertices = (rect: Rect): RectPoint => {
  const { x, y, width, height } = rect;
  return {
    topLeft: { x, y },
    topRight: { x: x + width, y },
    bottomLeft: { x, y: y + height },
    bottomRight: { x: x + width, y: y + height },
  };
};
