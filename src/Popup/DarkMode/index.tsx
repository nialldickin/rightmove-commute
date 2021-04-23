import React, { ReactElement } from "react";
import DarkModeIcon from "./DarkModeIcon";
import "./style.css";

interface Props {
  toggleDarkMode: () => void;
}

const DarkModeBtn = ({ toggleDarkMode }: Props): ReactElement => (
  <button className="dark-mode-btn" type="button" onClick={toggleDarkMode}>
    <DarkModeIcon />
  </button>
);

export default DarkModeBtn;
