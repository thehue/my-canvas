import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";

interface Props {
  handleImage: (image: HTMLImageElement) => void;
}

const ImageIconButton = ({ handleImage }: Props): ReactElement => {
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        handleImage(image);
        console.log(image);
      };
    };

    if (file) {
      reader.readAsDataURL(file); // 이미지를 base64로 읽기
    }
  };

  return (
    <>
      <Label htmlFor={"file"}>
        <img
          src={"https://cdn-icons-png.flaticon.com/512/1375/1375106.png"}
          alt={"img icon"}
          width={40}
          height={40}
        />
      </Label>
      <Input
        id={"file"}
        type={"file"}
        accept={"image/*"}
        onChange={onChangeFile}
      />
    </>
  );
};

export default ImageIconButton;

const Label = styled.label`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
  }
`;

const Input = styled.input`
  display: none;
`;
