import Head from "next/head";
import { useEffect, type ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

import RedirectPage from "@/pages/404";
import { splashScreenLinks } from "services/splashscreenLinks";
import Header from "./Header";
import AvatarMenu from "./AvatarMenu";
import { User } from "next-auth";
import AppBar from "./AppBar";

type LayoutProps = {
  me?: User;
  authorized: boolean;
  loaded: boolean;
  children?: ReactNode;
};
export default function Layout(props: LayoutProps) {
  //--set content based on: loaded, authorized--
  let content;
  if (props.loaded) {
    if (props.authorized) {
      content = props.children;
    } else {
      content = RedirectPage({
        errorCode: "403",
        msg1: "Forbidden",
        msg2: "You do not have permissions to view this page",
      });
    }
  } else {
    // content = "";
    content = props.children;
  }
  //desparation CSS to stop overscrolling
  const css = `
  html, body {
    overscroll-behavior: none;
  }
  `;

  //desparation JS to stop zooming
  if (typeof window !== "undefined") {
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
      // @ts-expect-error
      document.body.style.zoom = 1;
    });

    document.addEventListener("gesturechange", function (e) {
      e.preventDefault();
      // @ts-expect-error
      document.body.style.zoom = 1;
    });
    document.addEventListener("gestureend", function (e) {
      e.preventDefault();
      // @ts-expect-error
      document.body.style.zoom = 1;
    });
  }

  //--ret--
  return (
    <>
      <Head>
        {/*Basics*/}
        <title>EZFind</title>
        <meta name="description" content="Inventory management system" />
        {/*Viewport*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        {/*PWA*/}
        <meta name="theme-color" content="#fffffe" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/*Icons*/}
        <link rel="icon" href="/icon/favicon.ico" />
        {/* #dev-only: trick to instantly refresh the favicon, using full pathname */}
        {/* <link rel="icon" href="https://localhost:3000/icon/favicon.ico" /> */}
        <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png"></link>
        {splashScreenLinks}
        {/*Forced CSS styling underlay*/}
        <style>{css}</style>
      </Head>
      <main>
        <Flex
          flexDir="column"
          overflow="hidden"
          // overscrollY="none"
          height={"100svh"}
          width={"100%"}
          position={"fixed"}
          sx={{
            userSelect: "none",
            touchAction: "none",
            // overscrollBehavior: "none",
            // WebkitOverflowScrolling: "touch",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            WebkitUserDrag: "none",
            WebkitTapHighlightColor: "rgba(0,0,0,0)",
          }}
        >
          <Header right={<AvatarMenu me={props.me} />} />
          {content}
          <AppBar />
        </Flex>
      </main>
    </>
  );
}

/*
  useEffect(() => {
    const html = document.querySelector("html") || new HTMLBodyElement();
    const body = document.querySelector("body") || new HTMLBodyElement();
    // html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.touchAction = "none";
  });
  */
