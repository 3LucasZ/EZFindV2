import { AddIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Heading,
  Center,
  Link,
  Icon,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

type FABProps = {
  onClick: Function;
  icon: IconType;
};

export const FAB = ({ icon, onClick }: FABProps) => {
  return (
    <Button
      aria-label={""}
      position="fixed"
      right="8px"
      bottom="calc(58px + env(safe-area-inset-bottom))"
      rounded="full"
      h="16"
      w="16"
      onClick={(e) => onClick()}
      zIndex={100}
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
    >
      <Icon as={icon} boxSize="10" p="0" m="0" strokeWidth={1.5} />
    </Button>
  );
};
