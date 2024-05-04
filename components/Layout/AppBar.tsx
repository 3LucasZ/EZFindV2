import { Box, Center, HStack, Icon, IconButton } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import Router from "next/router";
import { IconType } from "react-icons";

export default function AppBar() {
  return (
    <HStack
      position="fixed"
      bottom="0"
      w="100%"
      bg="teal.300"
      h={"calc(50px + env(safe-area-inset-bottom))"}
      p={0}
    >
      <AppBarBtn icon={FaHome} href="/" />
      <AppBarBtn icon={FaTools} href="/manage-items" />
      <AppBarBtn icon={FaBoxes} href="/manage-storages" />
      <AppBarBtn icon={FaCircleInfo} href="/help" />
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
      w={"33%"}
      h={"100%"}
      rounded="unset"
      aria-label={""}
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
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
