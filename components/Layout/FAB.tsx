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
  Text,
  Box,
  HStack,
  ComponentWithAs,
  IconProps,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

type FABProps = {
  onClick: Function;
  icon: IconType | ComponentWithAs<"svg", IconProps>;
  name?: string;
};

export const FAB = ({ icon, onClick, name }: FABProps) => {
  return (
    <HStack
      //---position
      position="fixed"
      right="8px"
      bottom="calc(58px + env(safe-area-inset-bottom))"
      //---sizing + spacing
      minH="16"
      minW="16"
      maxW={name ? "" : "16"}
      py={name ? "3" : "auto"}
      px={name ? "6" : "auto"}
      //---looks
      bg="teal.300"
      _hover={{ bg: "teal.400" }}
      color="white"
      rounded="full"
      // boxShadow={"2xl"}
      //---misc
      onClick={(e) => onClick()}
      zIndex={100}
    >
      <Icon as={icon} boxSize="6" p="0" m="0" w="100%" />
      <Text fontSize={"2xl"} hidden={name ? false : true}>
        {name}
      </Text>
    </HStack>
  );
};
