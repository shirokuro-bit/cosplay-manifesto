import {Image, Transformer} from "react-konva";
import {Fragment, useEffect, useRef} from "react";
import {imageItemType} from "../App.tsx";
import Konva from "konva";
import {KonvaEventObject} from "konva/lib/Node";
import {useDispatch, useSelector} from "react-redux";
import {replace} from "../modules/imageItemsSlice.ts";
import {RootState} from "../modules/store.ts";
import {select} from "../modules/selectIdSlice.ts";

type ImgLayerItemType = {
  item: imageItemType
}

export const ImgLayerItem = ({item}: ImgLayerItemType) => {
  const imageRef = useRef<Konva.Image>(null!);
  const trRef = useRef<Konva.Transformer>(null!);
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  
  const isSelected = state.selectId.id === item.id;
  
  const onSelect = () => {
    dispatch(select(item.id));
  };
  
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()!.batchDraw();
    }
  }, [isSelected]);
  
  const imageItemHandleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.name();
    const items = state.imageItems.slice();
    const item = state.imageItems.find((i) => i.id === id)!;
    const index = state.imageItems.indexOf(item);
    
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
    };
    dispatch(replace(items));
  };
  
  return (
    <Fragment>
      <Image
        name={item.id}
        image={item.image}
        ref={imageRef}
        draggable
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={imageItemHandleDragEnd}
        onTransformEnd={imageItemHandleDragEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>);
};