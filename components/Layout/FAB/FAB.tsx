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
  bg?: string;
  hoverBg?: string;
  bottomOffset?: number;
  hidden?: boolean;
};

export const FAB = ({
  icon,
  onClick,
  name,
  bg,
  hoverBg,
  bottomOffset,
  hidden,
}: FABProps) => {
  !bottomOffset && (bottomOffset = 0);
  return (
    <HStack
      //---position
      position={"fixed"}
      right={"8px"}
      bottom={`calc(58px + env(safe-area-inset-bottom) + ${bottomOffset}px)`}
      //---sizing + spacing
      minH="16"
      minW="16"
      maxW={name ? "" : "16"}
      py={name ? "3" : "auto"}
      px={name ? "6" : "auto"}
      //---looks
      bg={bg ? bg : "teal.300"}
      _hover={{ bg: hoverBg ? hoverBg : "teal.400" }}
      color="white"
      rounded="full"
      // boxShadow={"2xl"}
      //---misc
      onClick={(e) => onClick()}
      zIndex={100}
      transition={"bottom 0.3s"}
      hidden={hidden}
    >
      <Icon as={icon} boxSize="6" p="0" m="0" w="100%" />
      <Text fontSize={"2xl"} hidden={name ? false : true}>
        {name}
      </Text>
    </HStack>
  );
};
