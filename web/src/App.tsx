import {Fragment, useEffect, useRef, useState} from "react";
import {MenuButton} from "./component/MenuButton.tsx";
import {Image, Layer, Stage, Text} from "react-konva";
import {KonvaEventObject} from "konva/lib/Node";
import Konva from "konva";
import {TemplateDropZone} from "./component/TemplateDropZone.tsx";
import {ImgDropZone} from "./component/ImgDropZone.tsx";
import DeleteIcon from "./assets/delete_FILL0_wght400_GRAD0_opsz24.svg";
import {ImgLayerItem} from "./component/ImgLayerItem.tsx";

export type effectItemType = {
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

export type inputModeType =  "Aa" | "○" | "✔" | "削除";

export type modeType = {
  text: inputModeType,
  fontSize: number
}

const defaultMode: modeType = {
  text: "Aa",
  fontSize: 30,
};

const App = () => {
  const [mode, setMode] = useState<modeType>(defaultMode);
  const [templateImage, setTemplateImage] = useState<HTMLImageElement>();
  const [imageLayerItems, setImageLayerItems] = useState<imageItemType[]>([]);
  const [effectLayerItems, setEffectLayerItems] = useState<effectItemType[]>([]);
  const [isLayerSwap, setLayerSwap] = useState(false);
  
  const [selectId, setSelectId] = useState<string | null>(null);
  
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
            setImageLayerItems={setImageLayerItems}/>;
        })}
      </>
    );
  };
  
  const templateLayer = () => {
    return <Image image={templateImage} name={"template"}/>;
  };
  
  const effectLayer = () => {
    return (
      <>
        {effectLayerItems.map((item) => {
          return <Text
            key={item.id}
            name={item.id}
            text={item.text}
            fontSize={item.fontSize}
            draggable
            x={item.x}
            y={item.y}
            onDragStart={() => setMode({text: "削除", fontSize: 0})}
            onDragEnd={effectItemHandleDragEnd}
            onTouchEnd={effectItemHandleDragEnd}
          />;
        })}
      </>
    );
  };
  
  const overlayLayerItem = () => {
    const deleteIcon = new window.Image();
    deleteIcon.src = DeleteIcon;
    if (stageRef.current == null) return;
    const stageSize = stageRef.current.getSize();
    
    return (<Image image={deleteIcon}
                   visible={mode.text == "削除"}
                   x={(stageSize.width * 0.5) - (deleteIcon.width * 0.5)}
                   y={stageSize.height * 0.85 - (deleteIcon.height * 0.5)}
    />);
  };
  
  const isDeleteArea = (pointer: { x: number, y: number }): boolean => {
    const stageSize = stageRef.current.getSize();
    const deleteArea = {
      beginX: stageSize.width * 0.5 - 10,
      endX: stageSize.width * 0.5 + 10,
      beginY: stageSize.height * 0.85 - 10,
      endY: stageSize.height * 0.85 + 10
    };

    //TODO: 環境に応じて削除の判定範囲を変える
    
    return ((deleteArea.beginX < pointer.x && pointer.x < deleteArea.endX) && (deleteArea.beginY < pointer.y && pointer.y < deleteArea.endY));
  };
  
  const effectItemHandleDragEnd = (e: KonvaEventObject<DragEvent | TouchEvent>) => {
    const id = e.target.name();
    const items = effectLayerItems.slice();
    const item = effectLayerItems.find((i) => i.id === id)!;
    const index = effectLayerItems.indexOf(item);
    
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    if (stageRef.current.pointerPos == null) {
      console.error("ポインターを取得できません");
      return;
    }
    if (mode.text == "削除" && isDeleteArea(stageRef.current.pointerPos)) items.splice(index, 1);
    setMode(defaultMode);
    setEffectLayerItems(items);
  };
  
  useEffect(() => {
    if (templateImage || imageLayerItems) {
      // 画像が読み込まれたらステージを再描画
      // 画像の読み込みに関する処理をここに移動する
      let layer;
      if (isLayerSwap) {
        layer = [templateLayer(), imgLayer(), effectLayer(), overlayLayerItem()];
      } else {
        layer = [imgLayer(), templateLayer(), effectLayer(), overlayLayerItem()];
      }
      setLayer(layer);
    }
  }, [templateImage, effectLayerItems, imageLayerItems, mode, selectId]);
  
  const [layer, setLayer] = useState([imgLayer(), templateLayer(), effectLayer(), overlayLayerItem()]);
  
  const onClickPosition = (e: KonvaEventObject<MouseEvent | Event>) => {
    if (e.target.name() === "template") {
      setSelectId(null);
    }
    
    if (isLayerSwap) return;
    
    const text = mode.text === "Aa" ? textAreaRef.current.value : mode.text;
    if (text == "") return;
    
    const tmp: effectItemType = {
      id: "EffectItemNode-" + crypto.randomUUID(),
      text: text,
      fontSize: mode.fontSize,
      x: e.target.getStage()!.pointerPos!.x,
      y: e.target.getStage()!.pointerPos!.y
    };
    setEffectLayerItems(prevState => [...prevState, tmp]);
  };
  
  return (
    <>
      <h1>コスマニ</h1>
      <h2>注意書き</h2>
      <ul>
        サイトについて
        <li>本サービスはユーザーの端末で完結するサービスです。サーバーに画像データ等が送られることはございません。</li>
        <li>ただし、サービスの検証・改善のためGoogleのアクセス解析ツールにて情報収集を行っております。</li>
      </ul>
      <ul>
        機能について
        <li>編集を保存する機能は現状ございません。リロードやタスク切りが発生しますとデータが消えてしまいますのでご注意ください。</li>
      </ul>
      
      <div id={"menu"}>
        <MenuButton setState={setMode} value={"Aa"} fontSize={30}/>
        <textarea ref={textAreaRef}></textarea>
        <MenuButton setState={setMode} value={"○"} fontSize={90}/>
        <MenuButton setState={setMode} value={"✔"} fontSize={30}/>
        <button onClick={() => {
          setLayerSwap(prevState => {
            if (prevState) {
              setLayer([imgLayer(), templateLayer(), effectLayer(), overlayLayerItem()]);
            } else {
              setLayer([templateLayer(), imgLayer(), effectLayer(), overlayLayerItem()]);
            }
            return !prevState;
          });
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
  );
};

export default App;
//TODO: イメージレイヤーの画像の削除機能
//TODO: タップした位置を中心にエフェクト生成(textAline, baseLine)
//TODO: エフェクトのスタイルを選べるようにする
//TODO: 背景編集Modeなのかを分かりやすくする
//TODO: イメージ画像のトリミング
//TODO: 全体のリファクタリング