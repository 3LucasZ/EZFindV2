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
};

export const FAB = ({ onClick }: FABProps) => {
  return (
    <Button
      aria-label={""}
      position="fixed"
      right="8px"
      bottom="58px"
      rounded="full"
      h="16"
      w="16"
      onClick={(e) => onClick()}
      zIndex={100}
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
    >
      <AddIcon boxSize="6" />
    </Button>
  );
};
