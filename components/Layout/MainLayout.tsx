import Head from "next/head";
import { useEffect, useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import AppBar from "./AppBar";
import Header from "./Header";
import Custom404 from "archive/old_404";
import RedirectPage from "../Main/RedirectPage";
import React from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import SimpleSidebar from "./ExampleDrawer";
import AvatarMenu from "./AvatarMenu";
import NavDrawer from "./NavDrawer";
import { GroupProps } from "components/Widget/GroupWidget";

type LayoutProps = {
  isAdmin: boolean | undefined;
  authorized?: boolean;
  loading?: boolean;
  group?: GroupProps;
  children: ReactNode;
};

export default function Layout({
  isAdmin,
  authorized,
  loading,
  group,
  children,
}: LayoutProps) {
  //set properties
  useEffect(() => {
    const html = document.querySelector("html") || new HTMLBodyElement();
    const body = document.querySelector("body") || new HTMLBodyElement();
    html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.touchAction = "none";
  });

  // set content based on: loading, authorized
  var content;
  if (loading == true) {
    content = (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  } else if (authorized == false) {
    content = (
      <RedirectPage
        errorCode="401"
        msg1="Unauthorized"
        msg2="You do not have permissions to view this page"
      />
    );
  } else {
    content = children;
  }

  return (
    <>
      <Head>
        <title>EZFind</title>
        <meta name="description" content="Machine shop management system" />
        {/* ICON */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        {/*PWA UI-->*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        <Flex
          flexDir="column"
          overflow="hidden"
          overscrollY="none"
          height={"100svh"}
          width={"100%"}
          position={"fixed"}
          sx={{
            userSelect: "none",
            touchAction: "none",
            overscrollBehavior: "none",
            WebkitOverflowScrolling: "touch",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            WebkitUserDrag: "none",
            WebkitTapHighlightColor: "rgba(0,0,0,0)",
          }}
        >
          <Header
            left={
              group && (
                <NavDrawer
                  image={group.image}
                  title={group.name}
                  id={group.id}
                />
              )
            }
            right={<AvatarMenu isAdmin={isAdmin} />}
          />

          {content}
          <AppBar />
        </Flex>
      </main>
      {/* <SimpleSidebar /> */}
    </>
  );
}
