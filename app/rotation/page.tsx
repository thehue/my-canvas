"use client";

import * as React from "react";
import { ReactElement, useRef, useState } from "react";
import { Canvas } from "@/app/page";
import styled from "styled-components";
import ImageIconButton from "@/app/src/components/rotation/ImageIconButton";

const RotationPage = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  return (
    <Editor>
      <Canvas ref={canvasRef} width={800} height={600} />
      <ButtonWrapper>
        <ImageIconButton
          handleImage={(image: HTMLImageElement) => setImage(image)}
        />
      </ButtonWrapper>
    </Editor>
  );
};

export default RotationPage;

const Editor = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;
