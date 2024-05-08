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
        py="2"
        //---basic outline---
        // bg="white"
        // color="blue.300"
        //---basic filled---
        // bg="teal.200"
        // color="white"
        //---gradient outline---
        // bgGradient={"linear(to-b, teal.300, blue.400)"} //dark
        bgGradient={"linear(to-b, teal.200, blue.300)"} //light
        bgClip={"text"}
        //---gradient filled---
        // bgGradient={"linear(to-b, teal.200, blue.200)"}
        // color="white"
      >
        {left}
        <Heading
          size={["xl"]}
          // size={["xl", "2xl", "3xl"]}
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
