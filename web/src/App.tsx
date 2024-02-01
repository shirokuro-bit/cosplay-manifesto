import {Fragment, useEffect, useRef, useState} from "react";
import {MenuButton} from "./component/MenuButton.tsx";
import {Image, Layer, Rect, Stage, Text} from "react-konva";
import {KonvaEventObject} from "konva/lib/Node";
import Konva from "konva";
import {TemplateDropZone} from "./component/TemplateDropZone.tsx";
import {ImgDropZone} from "./component/ImgDropZone.tsx";
import DeleteIcon from "./assets/delete_FILL0_wght400_GRAD0_opsz24.svg"
import {ImgLayerItem} from "./component/ImgLayerItem.tsx";


type effectItemType = {
  id: string,
  text: string,
  fontSize: number
  x: number,
  y: number,
}

export type imageItemType = {
  id: string
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
}

export type modeType = {
  text: "Aa" | "" | "○" | "✔" | "削除" | string,
  fontSize: number
}

const defaultMode: modeType = {
  text: "Aa",
  fontSize: 30,
}


const App = () => {
  const [mode, setMode] = useState<modeType>(defaultMode);
  const [templateImage, setTemplateImage] = useState<HTMLImageElement>();
  const [imageLayerItems, setImageLayerItems] = useState<imageItemType[]>([]);
  const [effectLayerItems, setEffectLayerItems] = useState<effectItemType[]>([])
  const [isLayerSwap, setLayerSwap] = useState(false);
  
  const [selectId, setSelectId] = useState<string | null>(null)
  
  const stageRef = useRef<Konva.Stage>(null!);
  const textAreaRef = useRef<HTMLTextAreaElement>(null!);
  
  const imgLayer = () => {
    return (
      <>
        {imageLayerItems.map((item) => {
          return <ImgLayerItem
            key={item.id}
            item={item}
            imageLayerItems={imageLayerItems}
            isSelected={selectId === item.id}
            onSelect={() => setSelectId(item.id)}
            setImageLayerItems={setImageLayerItems}/>
        })}
      </>
    );
  }
  const templateLayer = () => {
    return (
      <Image image={templateImage}/>
    );
  }
  const effectLayer = () => {
    return (
      <>
        {effectLayerItems.map((item) => {
          return <Text
            key={item.id}
            name={item.id}
            text={item.text}
            fontSize={item.fontSize}
            // align={"center"}
            // verticalAlign={"middle"}
            draggable
            x={item.x}
            y={item.y}
            fill={"green"}
            // onDragStart={() => setMode({text: "削除", fontSize: 0})}
            onDragEnd={effectItemHandleDragEnd}
          />
        })}
      </>
    );
  }
  
  const overlayLayer = () => {
    if (stageRef.current == null) return
    const stageSize = stageRef.current.getSize()
    return (<Rect width={stageSize.width}
                  height={stageSize.height}
                  fill={"gray"}
                  opacity={0.8}
                  visible={mode.text == "削除"}
      // onClick={() => setMode(defaultMode)}
      // onTap={() => setMode(defaultMode)}
    />);
  }
  
  const overlayLayerItem = () => {
    const deleteIcon = new window.Image();
    deleteIcon.src = DeleteIcon;
    if (stageRef.current == null) return
    const stageSize = stageRef.current.getSize()
    
    return (<Image image={deleteIcon}
                   visible={mode.text == "削除"}
                   x={(stageSize.width * 0.5) - (deleteIcon.width * 0.5)}
                   y={stageSize.height * 0.85 - (deleteIcon.height * 0.5)}
    />);
  }
  
  const imageItemHandleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.name();
    const items = imageLayerItems.slice();
    const item = imageLayerItems.find((i) => i.id === id)!;
    const index = imageLayerItems.indexOf(item);
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    setImageLayerItems(items);
  }
  
  const isDeleteArea = (position: { x: number, y: number }, size: { width: number, height: number }): boolean => {
    const itemCenterPosition = {
      x: position.x + (size.width * 0.5),
      y: position.y + (size.height * 0.5)
    }
    
    const stageSize = stageRef.current.getSize()
    const deleteArea = {
      beginX: stageSize.width * 0.5 - 10,
      endX: stageSize.width * 0.5 + 10,
      beginY: stageSize.height * 0.85 - 10,
      endY: stageSize.height * 0.85 + 10
    }
    
    return ((deleteArea.beginX < itemCenterPosition.x && itemCenterPosition.x < deleteArea.endX) && (deleteArea.beginY < itemCenterPosition.y && itemCenterPosition.y < deleteArea.endY));
  }
  
  const effectItemHandleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.name();
    const items = effectLayerItems.slice();
    const item = effectLayerItems.find((i) => i.id === id)!;
    const index = effectLayerItems.indexOf(item);
    
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    if (mode.text == "削除" && isDeleteArea(e.target.position(), e.target.size())) items.splice(index, 1)
    // setMode(defaultMode)
    setEffectLayerItems(items);
  };
  
  useEffect(() => {
    if (templateImage || imageLayerItems) {
      // 画像が読み込まれたらステージを再描画
      // 画像の読み込みに関する処理をここに移動する
      let layer
      if (isLayerSwap) {
        layer = [templateLayer(), imgLayer(), overlayLayer(), effectLayer(), overlayLayerItem()]
      } else {
        layer = [imgLayer(), templateLayer(), overlayLayer(), effectLayer(), overlayLayerItem()];
      }
      setLayer(layer);
    }
  }, [templateImage, effectLayerItems, imageLayerItems, mode, selectId]);
  
  const [layer, setLayer] = useState([imgLayer(), templateLayer(), overlayLayer(), effectLayer(), overlayLayerItem()])
  
  const onClickPosition = (e: KonvaEventObject<MouseEvent | Event>) => {
    if (mode.text == "削除") return
    let text = mode.text
    if (mode.text == "Aa") {
      text = textAreaRef.current.value;
      if (text == "") return
    }
    const tmp: effectItemType = {
      id: "EffectItemNode-" + effectLayerItems.length,
      text: text,
      fontSize: mode.fontSize,
      x: e.target.getStage()!.pointerPos!.x,
      y: e.target.getStage()!.pointerPos!.y
    };
    setEffectLayerItems(prevState => [...prevState, tmp])
  }
  
  return (
    <>
      <h1>コスプレ-参加表明</h1>
      <div id={"menu"}>
        <MenuButton setState={setMode} value={"Aa"} fontSize={30}/>
        <textarea ref={textAreaRef}></textarea>
        <MenuButton setState={setMode} value={"○"} fontSize={90}/>
        <MenuButton setState={setMode} value={"✔"} fontSize={30}/>
        <MenuButton setState={setMode} value={"削除"} fontSize={30}/>
        <button onClick={() => {
          setLayerSwap(prevState => {
            if (prevState) {
              setLayer([imgLayer(), templateLayer(), effectLayer(), overlayLayerItem()])
            } else {
              setLayer([templateLayer(), imgLayer(), effectLayer(), overlayLayerItem()])
            }
            return !prevState
          })
        }} value={"背面を編集"}>{"背面を編集"}</button>
        <button onClick={() => {
          const uri = stageRef.current.toDataURL();
          const link = document.createElement('a');
          link.download = "参加表明";
          link.href = uri;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}>{"ダウンロード"}</button>
        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-text="参加表明"
           data-url="http://localhost:5173/" data-show-count="false">Tweet</a>
        <script src="https://platform.twitter.com/widgets.js"></script>
        <p>{mode.text}</p>
      </div>
      <TemplateDropZone setState={setTemplateImage}/>
      <ImgDropZone setState={setImageLayerItems}/>
      
      <Stage width={templateImage == undefined ? window.innerWidth : templateImage.naturalWidth}
             height={templateImage == undefined ? window.innerHeight : templateImage.naturalHeight}
             ref={stageRef}
      >
        <Layer onClick={onClickPosition} onTap={onClickPosition}>
          {layer.map((value, index) => <Fragment key={index} children={value}/>)}
        </Layer>
      </Stage>
    </>
  )
}

export default App
//TODO: 削除機能改良
//TODO: タップした位置を中心にエフェクト生成(textAline, baseLine)
//TODO: イメージ画像のトリミング
//TODO: 全体のリファクタリング
//TODO: MUI導入