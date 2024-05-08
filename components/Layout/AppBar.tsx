import { Box, Center, HStack, Icon, IconButton } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import Router from "next/router";
import { IconType } from "react-icons";
import { FiCompass, FiHome, FiInfo } from "react-icons/fi";

export default function AppBar() {
  return (
    <HStack
      position="fixed"
      bottom="0"
      w="100%"
      bg="teal.300"
      h={"calc(50px + env(safe-area-inset-bottom)/4)"}
      // borderTopLeftRadius={"20"}
      // borderTopRightRadius={"20"}
      overflow={"clip"}
      p={0}
      gap={0}
    >
      <AppBarBtn icon={FiHome} href="/" />
      <AppBarBtn icon={FiCompass} href="/help" />
      <AppBarBtn icon={FiInfo} href="/help" />
      {/* <AppBarBtn icon={FaTools} href="/manage-items" />
      <AppBarBtn icon={FaBoxes} href="/manage-storages" /> */}
    </HStack>
  );
}

type AppBarBtnProps = {
  icon: IconType;
  href: string;
};
function AppBarBtn({ icon, href }: AppBarBtnProps) {
  return (
    <Box
      w={"100%"}
      h={"100%"}
      aria-label={""}
      pt="13px"
      onClick={() => Router.push(href)}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
      //---basic outline---
      // bg="white"
      // color="teal.200"
      //---basic filled---
      // bg="teal.200"
      // color="white"
      // _hover={{ color: "teal.400" }}
      //---gradient outline
      bg="white"
      borderWidth="0.5px"
      borderColor="grey"
      //---gradient---
      // bgGradient="linear(to-b, teal.200, blue.200)"
      // _hover={{ color: "blue.300" }}
    >
      {
        <Center>
          <Icon
            as={icon}
            boxSize="23"
            //gradient-outline
            stroke="url(#blue-gradient)"
            // fill="url(#blue-gradient)"
          />
          <svg width="0" height="0">
            <linearGradient
              id="blue-gradient"
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop stopColor="var(--chakra-colors-teal-200" offset="0%" />
              <stop stopColor="var(--chakra-colors-blue-200" offset="100%" />
            </linearGradient>
          </svg>
          <svg width="0" height="0">
            <linearGradient
              id="red-gradient"
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop stopColor="var(--chakra-colors-orange-300" offset="0%" />
              <stop stopColor="var(--chakra-colors-red-300" offset="100%" />
            </linearGradient>
          </svg>
        </Center>
      }
    </Box>
  );
}
