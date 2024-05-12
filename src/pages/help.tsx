import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  HStack,
  Heading,
  Icon,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiAtSign, FiMapPin, FiPhone, FiSun } from "react-icons/fi";
import { responsivePx } from "services/constants";

type PageProps = {};

export default function Home({}: PageProps) {
  const { data: session } = useSession();

  const titleSz = [130, 130, 200, 300];
  const titleHR = 5 / 6; //(title height / title fontSize) ratio
  const subtitleR = 1 / 6; //(subtitle fontSize / title fontSize) ratio

  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Box px="5" overflowY="auto">
        {/* <Text fontSize="4xl">Version</Text>
        <Text fontSize="xl">2.4 (Alpha)</Text> */}
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

        <Accordion allowToggle px={responsivePx}>
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you what items a
          storage does not contain or what storages an item can not be found in."
          />
        </Accordion>

        <Text fontSize="4xl">Dymo Instructions</Text>
        <Text fontSize="xl">In order to have dymo printing functionality:</Text>
        <UnorderedList fontSize="xl">
          <ListItem fontSize="xl">
            Install the official Dymo Connect SDK for Mac or Windows from:
            https://www.dymo.com/support?cfid=online-support-sdk
          </ListItem>
          <ListItem fontSize="xl">
            Accept/allow any changes the SDK wants to make on your device
          </ListItem>
        </UnorderedList>
        <Text fontSize="xl">Make sure:</Text>
        <UnorderedList fontSize="xl">
          <ListItem fontSize="xl">
            Dymo Connect Service is running on your computer
          </ListItem>
          <ListItem fontSize="xl">
            Service port is at 41951 (default) Connected to a printer via USB
            Dymo
          </ListItem>
          <ListItem fontSize="xl">Certificate is trusted</ListItem>
        </UnorderedList>
        <Text fontSize={"4xl"}>Documents</Text>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/867a55b1-f612-458c-a96b-73337e43fe99"
          display={"block"}
          fontSize={"xl"}
        >
          Privacy Policy
        </Link>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/a127aadd-459e-4134-89e1-c2773f78391f"
          display={"block"}
          fontSize={"xl"}
        >
          Terms of Service
        </Link>
        <Text fontSize="4xl">Help</Text>
        <Text fontSize="xl">
          Please do not hesitate to email us at sahuber@vcs.net if you have any
          questions, need further instruction, or have suggestions for
          improvement.
        </Text>
        <Box h="10px"></Box>
      </Box>
      <Box minH="calc(50px + env(safe-area-inset-bottom))"></Box>
    </Layout>
  );
}

type FAQItemProps = {
  Q: string;
  A: string;
};
function FAQItem(props: FAQItemProps) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {props.Q}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{props.A}</AccordionPanel>
    </AccordionItem>
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

/*
<FAQItem
            Q="What are the numbers displayed in the widgets?"
            A="In the manage items page, the number shown is the total stock of
          the item. In the manage storages page, the number shown is the total
          number of items contained in that storage. When viewing a specific
          item, the number shown next to each storage is the amount of that item
          the storage contains. When viewing a specific storage, the number
          shown next to each item is the amount of that item the storage
          contains."
          />
*/
