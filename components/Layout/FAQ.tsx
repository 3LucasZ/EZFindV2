import {
  Stack,
  VStack,
  Heading,
  Card,
  CardBody,
  Box,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiAtSign, FiPhone, FiMapPin, FiSun } from "react-icons/fi";

export default function FAQ() {
  const titleSz = [130, 130, 200, 300];
  const titleHR = 5 / 6; //(title height / title fontSize) ratio
  const subtitleR = 1 / 6; //(subtitle fontSize / title fontSize) ratio
  return (
    <Box
      bg="blue.200"
      // bgGradient={"linear(to-br, blue.300, teal.300)"}
      rounded="3xl"
      p="6"
      mt="5"
    >
      <Stack minW="100%" direction={["column", "column", "row"]}>
        <VStack gap="0" h="100%" w="100%" alignSelf={"center"}>
          <Heading
            fontWeight={"black"}
            color="blue.300"
            fontSize={titleSz.map((sz) => sz + "px")}
            lineHeight={titleSz.map((sz) => sz * titleHR + "px")} //Height does NOT work on safari but on chrome. Line height works on both.
          >
            FAQ
          </Heading>
          <Heading
            fontSize={titleSz.map((sz) => sz * subtitleR + "px")}
            fontWeight="bold"
            color="white"
            textAlign={"center"}
          >
            Frequently Asked Questions
          </Heading>
        </VStack>
        <Card
          boxShadow={"md"}
          rounded={"3xl"}
          w="380px"
          maxW="100%"
          ml={"auto"}
          mr={["auto", "auto", "0"]}
          // ml={"auto"}
          // mr={["auto", "auto", "auto"]}
          // bgGradient="linear(to-br, blue.50, teal.50)"
        >
          <CardBody gap={4}>
            <Text fontWeight={"medium"} fontSize={"xl"}>
              Contact us
            </Text>
            <Box h="4" />
            <VStack align={"start"}>
              <ContactItem
                title="Email"
                subtitle="sahuber@vcs.net"
                icon={FiAtSign}
              />
              <ContactItem
                title="Phone"
                subtitle="+1 (408) 123 4567"
                icon={FiPhone}
              />
              <ContactItem
                title="Address"
                subtitle="100 Skyway Dr. #130"
                icon={FiMapPin}
              />
              <ContactItem
                title="Working hours"
                subtitle="8 a.m. - 3 p.m."
                icon={FiSun}
              />
            </VStack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
}
type ContactItemProps = {
  title: string;
  subtitle: string;
  icon: IconType;
};
function ContactItem(props: ContactItemProps) {
  return (
    <HStack gap={2}>
      <Icon
        as={props.icon}
        boxSize={10}
        // bg="blue.200"
        bgGradient={"linear(to-br, blue.200, teal.200)"}
        p={2}
        color="white"
        rounded="xl"
      />
      <VStack align={"start"} gap={0}>
        <Text
          color="grey"
          fontWeight={"light"}
          fontSize={"sm"}
          noOfLines={1}
          textOverflow={"ellipsis"}
        >
          {props.title}
        </Text>
        <Text fontSize={"lg"} noOfLines={1}>
          {props.subtitle}
        </Text>
      </VStack>
    </HStack>
  );
}
