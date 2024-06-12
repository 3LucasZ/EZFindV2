import {
  Avatar,
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, signIn, useSession } from "next-auth/react";
import Router from "next/router";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { User } from "next-auth";
import Image from "next/image";
import { FiBookOpen, FiNavigation, FiRefreshCcw } from "react-icons/fi";

type AvatarMenuProps = {
  me?: User;
};

export default function AvatarMenu({ me }: AvatarMenuProps) {
  return (
    <Menu>
      <MenuButton pos="relative" float="right" right="2">
        <Box minW="48px" minH="48px" borderRadius={"full"} overflow={"hidden"}>
          {me?.image ? (
            <Image
              width={48}
              height={48}
              src={me?.image}
              alt="avatar"
              priority
            />
          ) : (
            <Avatar name={me?.name ? me.name : ""} />
          )}
        </Box>
      </MenuButton>
      <MenuList textAlign="left" color="black">
        <Text px={3} py={1.5}>
          {me ? me.name : "Guest"}
        </Text>
        <Text px={3} py={1.5}>
          {me ? me.email : "You are not signed in"}
        </Text>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            me
              ? signOut({ callbackUrl: "/" })
              : signIn("google", { callbackUrl: "/" });
          }}
        >
          <Icon as={FcGoogle} pr="2" boxSize={6} />
          {me ? "Sign out" : "Sign in"}
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={(e) => {
            Router.push("/");
          }}
        >
          <Icon as={FiNavigation} pr="2" boxSize={6} />
          Landing Page
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            Router.reload();
          }}
        >
          <Icon as={FiRefreshCcw} pr="2" boxSize={6} />
          Refresh
        </MenuItem>
        {me && (
          <MenuItem
            onClick={(e) => {
              Router.push("/help");
            }}
          >
            <Icon as={FiBookOpen} pr="2" boxSize={6} />
            Help
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
