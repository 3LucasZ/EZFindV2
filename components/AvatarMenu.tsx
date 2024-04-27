import {
  Avatar,
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
import { debugMode } from "services/constants";
import { FcGoogle } from "react-icons/fc";

type AvatarMenuProps = {
  isAdmin: boolean | undefined;
};

export default function AvatarMenu({ isAdmin }: AvatarMenuProps) {
  const { data: session } = useSession();
  return (
    <Menu>
      <MenuButton pos="relative" float="right" right="2">
        <Avatar
          name={session?.user?.name ? session.user.name : ""}
          src={session?.user?.image ? session.user.image : ""}
        />
      </MenuButton>
      <MenuList textAlign="left">
        <Text px={3} py={1.5}>
          {session ? session.user!.name : "Guest"}
        </Text>
        <Text px={3} py={1.5}>
          {session ? session.user!.email : "You are not signed in"}
        </Text>
        <MenuDivider />
        {isAdmin && (
          <MenuItem
            onClick={(e) => {
              Router.push("/manage-admin");
            }}
          >
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            session
              ? signOut({ callbackUrl: "/ezfind/" })
              : signIn("google", { callbackUrl: "/ezfind/" });
          }}
        >
          <Icon as={FcGoogle} pr="2" boxSize={6} />
          {session ? "Sign out" : "Sign in"}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
