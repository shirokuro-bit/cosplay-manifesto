import {useDropzone} from "react-dropzone";
import React, {useCallback} from "react";
import {imageItemType} from "../App.tsx";
import {acceptFiles} from "./dropZoneOption.ts";

type ImgDropZoneType = {
  setState: React.Dispatch<React.SetStateAction<imageItemType[]>>
}

export const ImgDropZone = ({setState}:ImgDropZoneType) => {
  const onFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new window.Image();
      image.onload = () => {
        setState(prevState => {
          const tmp:imageItemType = {
            id: "ImageItemNode" + prevState.length,
            image: image,
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          };
          return [...prevState, tmp];
        });
      };
      image.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length < 2) {
      onFileChange(acceptedFiles[0]);
    }
  }, []);
  
  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: acceptFiles});
  
  return (
    <div {...getRootProps()}>
      <p>画像を ドロップ または、 クリックして選択</p>
      <input {...getInputProps()}/>
    </div>
  );
};