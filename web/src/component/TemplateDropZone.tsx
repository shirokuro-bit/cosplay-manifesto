import {useDropzone} from "react-dropzone";
import React, {useCallback} from "react";

type TemplateDropZoneType = {
  setState:  React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>
}

export const TemplateDropZone = ({setState}:TemplateDropZoneType) => {
  const onFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new window.Image();
      image.onload = () => {
        setState(image)
      };
      image.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length < 2) {
      onFileChange(acceptedFiles[0]);
    }
  }, []);
  
  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {"image/jpeg": [], "image/png": [],}, multiple: false})
  // X image/jpeg,image/png,image/webp
  
  return (
    <div {...getRootProps()}>
      <p>テンプレート画像を ドロップ または、 クリックして選択</p>
      <input {...getInputProps()}/>
    </div>
  );
}