import { keyframes } from "@chakra-ui/react";

//common props
export const responsivePx = [2, "5vw", "10vw", "15vw"];
export const responsiveHeaderFontSize = ["2xl", "2xl", "2xl", "3xl", "4xl"];
export const responsiveSubheaderFontSize = ["lg", "lg", "lg", "xl", "2xl"];

//common styles
//buttons
export const btnBase = {
  color: "white",
  transition: "background-color 0.3s",
  "aria-label": "",
};

export const tealBtn = {
  bg: "teal.300",
  _hover: { bg: "teal.400" },
  _active: { bg: "teal.500" },
  ...btnBase,
};

export const redBtn = {
  bg: "red.300",
  _hover: { bg: "red.400" },
  _active: { bg: "red.500" },
  ...btnBase,
};

export const orangeBtn = {
  bg: "orange.200",
  _hover: { bg: "orange.300" },
  _active: { bg: "orange.400" },
  ...btnBase,
};

//animations
export function animatedGradient(c1: string, c2: string) {
  const animation = keyframes`
  to {
     background-position: 200%;
   }`;
  return {
    backgroundSize: "200% auto",
    bgGradient: `linear(to-r, ${c1}, ${c2}, ${c1})`,
    animation: `${animation} 2s linear infinite`,
  };
}

//colors
export const gray = [
  "#F7FAFC",
  "#EDF2F7",
  "#E2E8F0",
  "#CBD5E0",
  "#A0AEC0",
  "#718096",
  "#4A5568",
  "#2D3748",
];
