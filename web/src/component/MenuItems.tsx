import {inputModeType, modeType} from "../App.tsx";
import {Box, Button, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {TweetLink} from "./TwitterShare.tsx";

type MenuItemsType = {
  setMode: React.Dispatch<React.SetStateAction<modeType>>,
  setEffectText: React.Dispatch<React.SetStateAction<string>>,
  mode: modeType,
  onDownloadClick: () => void,
  onSwapClick: () => void
}

type MenuButtonType = {
  value: inputModeType,
  fontSize: number,
  icon: JSX.Element
}

export const MenuItems = ({setMode, mode, setEffectText, onDownloadClick, onSwapClick}: MenuItemsType) => {
  const onClickHandle = (value: modeType) => {
    setMode(value);
  };
  
  const onChangeHandle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEffectText(e.target.value);
  };
  
  const MenuButton = ({value, fontSize, icon}: MenuButtonType) => {
    return (
      <ToggleButton value={value} size={"small"} onClick={() => onClickHandle({text: value, fontSize: fontSize})}>
        {icon}
      </ToggleButton>
    );
  };
  
  return (
    <Box display={"flex"}>
      <ToggleButtonGroup exclusive value={mode.text}>
        <MenuButton value={"Aa"} fontSize={30} icon={<EditIcon/>}/>
        <MenuButton value={"○"} fontSize={90} icon={<CircleOutlinedIcon/>}/>
        <MenuButton value={"✔"} fontSize={30} icon={<DoneIcon/>}/>
      </ToggleButtonGroup>
      <TextField
        size={"small"}
        id="effectItem-flexible"
        label={"effectItem"}
        placeholder={"テキスト"}
        onChange={onChangeHandle}
        multiline
      />
      <ToggleButton value={""} size={"small"} onClick={onSwapClick}>
        背景を編集
      </ToggleButton>
      <Button variant={"outlined"} onClick={onDownloadClick}>ダウンロード</Button>
      <TweetLink text={""} tweetText={""} url={""} hashtags={["コスマニ","参加表明"]}/>
    </Box>
  );
};