import React, { ReactElement } from "react";
import styled from "styled-components";
import DarkModeIcon from "./DarkModeIcon";

interface DarkModeButtonProps {
  toggleDarkMode: () => void;
}

// @apply place-self-start mr-5 hover:scale-110 my-auto transition transform focus:outline-none dark:text-yellow-200 text-gray-700;

const Button = styled.button`
  color: grey;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 5px;
  align-self: flex-start;

  &:hover {
  }

  &:focus {
    outline: none;
  }
`;

const DarkModeButton = ({
  toggleDarkMode,
}: DarkModeButtonProps): ReactElement => (
  <Button onClick={toggleDarkMode}>
    <DarkModeIcon />
  </Button>
);

export default DarkModeButton;
