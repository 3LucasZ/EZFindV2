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
        <Heading size={["xl", "2xl", "3xl"]} color="teal.500" w="100%">
          EZFind
        </Heading>
        {right}
      </HStack>
      <Divider />
    </>
  );
}
