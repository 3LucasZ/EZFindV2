import {
  Box,
  Divider,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import Router from "next/router";
import { IconType } from "react-icons";
import { FiTool } from "react-icons/fi";

interface Props {
  //Text
  label: string;
  value: string;
  link: string;
  //Icon
  icon: IconType;
  //Color
  dark: string;
  med: string;
  light: string;
}
export const CustomStat = (props: Props) => {
  return (
    <Box
      px={[2, 4, 6]}
      py={[2, 4, 6]}
      borderRadius="lg"
      boxShadow="md"
      // bgGradient={props.bgGradient}
      bg={props.light}
      _hover={{ bg: props.med }}
      onClick={() => Router.push(props.link)}
    >
      <HStack direction={"row"} p="0" m="0" gap="1">
        <Icon
          as={props.icon}
          bgGradient={`linear(to-br, ${props.dark}, ${props.med})`}
          color={props.light}
          boxSize={[8, 10, 12]}
          borderRadius={"full"}
          p={[1.5, 2, 2.5]}
        />
        <Box w="100%" color={props.dark}>
          <Heading noOfLines={1} size={["lg", "lg", "xl"]} textAlign={"center"}>
            {props.value}
          </Heading>
          <Text
            noOfLines={1}
            fontSize={["sm", "md", "lg"]}
            textAlign={"center"}
          >
            {props.label}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

{
  /* <Stack>
        <HStack>
          <Icon
            as={FiTool}
            bgGradient="linear(to-br, blue.400, blue.200)"
            color="blue.100"
            boxSize="8"
            borderRadius={"full"}
            p="1.5"
          />
          <Heading noOfLines={1} size={["md", "lg", "xl"]}>
            {value}
          </Heading>
        </HStack>
        <Text noOfLines={1} fontSize={["md", "md", "lg"]}>
          {label}
        </Text>
      </Stack> */
}
