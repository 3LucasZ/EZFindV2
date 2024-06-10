import { Divider, Heading, HStack, Link, Stack } from "@chakra-ui/react";
import React from "react";
import AvatarMenu from "./AvatarMenu";
import NavDrawer from "./NavDrawer";

type HeaderProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function Header({ left, right }: HeaderProps) {
  return (
    <>
      <HStack
        minW="100vw"
        display={"flex"}
        flexDir="row"
        textAlign={"center"}
        py="1"
      >
        {left}
        <Heading
          size={["xl"]}
          bgGradient={"linear(to-b, teal.200, blue.300)"} //light
          bgClip={"text"}
          w="100%"
        >
          EZFind
        </Heading>
        {right}
      </HStack>
      <Divider />
    </>
  );
}
