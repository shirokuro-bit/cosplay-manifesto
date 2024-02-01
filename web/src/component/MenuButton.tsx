import {modeType} from "../App.tsx";

type MenuButtonType = {
  setState: (value: modeType) => void,
  value: string,
  fontSize: number
}

export const MenuButton = ({value, setState, fontSize}: MenuButtonType) => {
  const selectMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as HTMLButtonElement
    setState({text: target.value, fontSize: fontSize})
  }
  
  return (
    <button onClick={selectMode} value={value}>{value}</button>
  );
}