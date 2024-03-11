import {inputModeType, modeType} from "../App.tsx";

type MenuButtonType = {
  setState: (value: modeType) => void,
  value: inputModeType,
  fontSize: number
}

export const MenuButton = ({value, setState, fontSize}: MenuButtonType) => {
  const selectMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as HTMLButtonElement;
    setState({text: target.value as inputModeType, fontSize: fontSize});
  };
  
  return (
    <button onClick={selectMode} value={value}>{value}</button>
  );
};