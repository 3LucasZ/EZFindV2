import Head from "next/head";
import { useEffect, type ReactNode } from "react";
import Header from "./Header";
import { Flex } from "@chakra-ui/react";
import AppBar from "./AppBar";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.querySelector("html") || new HTMLBodyElement();
    const body = document.querySelector("body") || new HTMLBodyElement();
    html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.touchAction = "none";
  });
  return (
    <>
      <Head>
        <title>EZ-Find</title>
        <meta name="description" content="Modern Inventory Tracker" />
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
            // userSelect: "none",
            touchAction: "none",
            overscrollBehavior: "none",
            WebkitOverflowScrolling: "touch",
            // WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            WebkitUserDrag: "none",
            WebkitTapHighlightColor: "rgba(0,0,0,0)",
          }}
        >
          {children}
          <AppBar />
        </Flex>
      </main>
    </>
  );
}
