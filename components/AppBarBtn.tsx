import { Center, HStack, Icon, IconButton, Link } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingStorage } from "react-icons/gi";
import { IconType } from "react-icons";

type AppBarBtnProps = {
  icon: IconType;
  href: string;
};
export default function AppBarBtn({ icon, href }: AppBarBtnProps) {
  return (
    <Link
      w={"33%"}
      h={"100%"}
      rounded="unset"
      aria-label={""}
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
      pt="13px"
      href={href}
    >
      {
        <Center>
          <Icon as={icon} boxSize="23" />
        </Center>
      }
    </Link>
  );
}
