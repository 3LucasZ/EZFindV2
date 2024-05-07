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
      // bg="teal.300"
      // _hover={{ bg: "teal.400" }}
      // bgGradient="linear(to-b, teal.300, teal.200)"
      // _hover={{ bgGradient: "linear(to-b, teal.400, teal.300)" }}
      bgGradient="linear(to-b, teal.200, blue.200)"
      color="white"
      _hover={{ color: "blue.300" }}
      pt="13px"
      onClick={() => Router.push(href)}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
    >
      {
        <Center>
          <Icon as={icon} boxSize="23" />
        </Center>
      }
    </Box>
  );
}
