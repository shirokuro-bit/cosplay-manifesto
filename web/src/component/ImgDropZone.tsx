import {useDropzone} from "react-dropzone";
import {useCallback} from "react";
import {imageItemType} from "../App.tsx";
import {acceptFiles} from "./dropZoneOption.ts";
import {useDispatch} from "react-redux";
import {add} from "../modules/imageItemsSlice.ts";

export const ImgDropZone = () => {
  const dispatch = useDispatch();
  
  const onFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new window.Image();
      image.onload = () => {
        const item:imageItemType = {
          id: "ImageItemNode-" + crypto.randomUUID(),
          image: image,
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        };
        
        dispatch(add(item));
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