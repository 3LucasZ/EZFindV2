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
import Header from "../Header";
import Custom404 from "archive/old_404";
import RedirectPage from "../RedirectPage";
import React from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

type LayoutProps = {
  isAdmin: boolean | undefined;
  authorized?: boolean;
  loading?: boolean;
  children: ReactNode;
};

export default function Layout({
  isAdmin,
  authorized,
  loading,
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

  //drawer properties
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <link rel="icon" href="/favicon.ico" />
        {/*PWA UI-->*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#fffffe" />
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
          <Header isAdmin={isAdmin} />

          {content}
          <AppBar />
        </Flex>
      </main>
      <HamburgerIcon
        onClick={onOpen}
        position={"fixed"}
        top={0}
        left={0}
        boxSize={[10, 10, 10]}
      >
        Open
      </HamburgerIcon>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
