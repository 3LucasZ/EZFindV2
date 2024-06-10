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
import { useState } from "react";
import { IconType } from "react-icons";
import {
  FiAtSign,
  FiPhone,
  FiMapPin,
  FiSun,
  FiChevronDown,
} from "react-icons/fi";

export function FAQHeader() {
  const titleSz = [130, 130, 200, 200, 260, 300];
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
          minW="260px"
          w="100%"
          maxW="380px"
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
                subtitle="vcs.rnd.ezsuite@gmail.com"
                icon={FiAtSign}
              />
              <ContactItem
                title="Phone"
                // subtitle="+1 (408) 123 4567"
                subtitle="Not available"
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

type FAQItemProps = {
  Q: string;
  A: string;
};
export function FAQItem(props: FAQItemProps) {
  const [active, setActive] = useState(false);
  const transitionTime = 0.25;
  return (
    <Box
      //--color--
      // bg="gray.50"
      bg={active ? "" : "gray.100"}
      color="gray.700"
      // color={active ? "black" : "white"}
      transition={`background-color ${transitionTime}s linear, color ${transitionTime}s linear, border-color ${transitionTime}s linear`}
      //--sizing--
      w="100%"
      maxW="800px"
      px={"4"}
      pt={"2"}
      pb={active ? "0" : "2"}
      position={"relative"}
      //--border--
      borderRadius={"xl"}
      borderColor={active ? "gray.300" : "gray.100"}
      // borderColor={"orange.200"}
      borderWidth={1}
      //function
      cursor={"pointer"}
      onClick={() => setActive(!active)}
    >
      <HStack>
        <Text w="100%">{props.Q}</Text>
        <Icon
          as={FiChevronDown}
          transform={active ? "rotate(180deg)" : ""}
          transition={`transform ${transitionTime}s linear`}
        />
      </HStack>
      <Box
        display={"grid"}
        gridTemplateRows={active ? "1fr" : "0fr"}
        transition={`grid-template-rows ${transitionTime}s ease-out`}
      >
        <Box overflow={"hidden"}>
          <Box h="4" />
          <Text>{props.A}</Text>
          <Box h="2" />
        </Box>
      </Box>
    </Box>
  );
}
