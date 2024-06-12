import { Icon } from "@chakra-ui/react";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton() {
  return (
    <Icon
      as={FiArrowLeft}
      minW="24px"
      minH="24px"
      pos="relative"
      float="left"
      left="2"
    />
  );
}
