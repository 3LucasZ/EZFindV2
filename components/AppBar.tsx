import { HStack, Icon, IconButton } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingStorage } from "react-icons/gi";
import AppBarBtn from "./AppBarBtn";

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
      <AppBarBtn icon={MdManageAccounts} href="/manage-items" />
      <AppBarBtn icon={GiSewingStorage} href="/manage-storages" />
    </HStack>
  );
}
