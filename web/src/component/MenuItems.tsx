import {inputModeType, modeType} from "../App.tsx";
import {Box, Button, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {TweetLink} from "./TwitterShare.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../modules/store.ts";
import {setMode} from "../modules/editModeSlice.ts";

type MenuItemsType = {
  setEffectText: React.Dispatch<React.SetStateAction<string>>,
  onDownloadClick: () => void,
  onSwapClick: () => void
}

type MenuButtonType = {
  value: inputModeType,
  fontSize: number,
  icon: JSX.Element
}

export const MenuItems = ({setEffectText, onDownloadClick, onSwapClick}: MenuItemsType) => {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  
  const onClickHandle = (value: modeType) => {
    dispatch(setMode(value));
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
      <ToggleButtonGroup exclusive value={state.editMode.text}>
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