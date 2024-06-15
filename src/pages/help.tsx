import { useSession } from "next-auth/react";

import {
  Box,
  Heading,
  HStack,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FAQHeader, FAQItem } from "components/Layout/FAQ";
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";

export default function Home() {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--ret--
  return (
    <Layout me={me} loaded={status !== "loading"} authorized={true} noAppBar>
      <Box px={[5, 10, 10, 28, 48, 60]} overflowY="auto">
        <FAQHeader />
        <Box h="8" />
        <VStack align={"start"} gap="4">
          <FAQItem
            Q="What is the version of this website?"
            A="You are currently using version 2.0 of the website."
          />
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you the opposite of what it originally shows. Example: instead of showing what items a storage contains, the display will show what items a storage does not contain."
          />
          <FAQItem
            Q="Why can't I edit certain things, like group user permissions?"
            A="You do not have the permissions to do so."
          />
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
          {/* <FAQItem
            Q="Why are only VCS accounts allowed to use the system?"
            A="For security reasons."
          /> */}
          {/* <FAQItem
            Q="Why are some widgets colored differently in some places?"
            A="Orange: machine is in use by the user in focus. Red: machine is in use. Purple: user is supervising. "
          /> */}
          <Text fontSize="2xl" id="DymoInstructions">
            Dymo Instructions
          </Text>
          <Text>In order to have dymo printing functionality:</Text>
          <UnorderedList>
            <ListItem>
              Install the official{" "}
              <Link
                href="https://www.dymo.com/support?cfid=online-support-sdk"
                color="teal.400"
              >
                Dymo Connect SDK
              </Link>{" "}
              for Mac or Windows.
            </ListItem>
            <ListItem>
              Accept and allow any changes the SDK wants to make on your device.
            </ListItem>
          </UnorderedList>
          <Text>Make sure:</Text>
          <UnorderedList>
            <ListItem>
              Dymo Connect Service is running on your computer.
            </ListItem>
            <ListItem>The service port is at 41951 (default).</ListItem>{" "}
            <ListItem>You are connected to a DYMO printer via USB.</ListItem>
            <ListItem>The DYMO certificate is trusted.</ListItem>
          </UnorderedList>
        </VStack>
        <Box h="8"></Box>
        <Box
          p="6"
          bg="blue.200"
          borderRadius={"3xl"}
          maxW="400px"
          w="100%"
          ml="auto"
          overflow={"auto"}
        >
          <Heading color="white" fontSize={"3xl"}>
            Documents
          </Heading>
          <Box h="4"></Box>
          <HStack
            px="4"
            py="3"
            bg="white"
            borderRadius={"2xl"}
            float="left"
            mb="4"
            onClick={() => Router.push("/terms-and-conditions")}
          >
            <Text fontSize={"lg"}>Terms and Conditions</Text>
            <Icon color="blue.400" as={FiExternalLink} />
          </HStack>
          <HStack
            px="4"
            py="3"
            bg="white"
            borderRadius={"2xl"}
            float="left"
            onClick={() => Router.push("/privacy-policy")}
          >
            <Text fontSize={"lg"}>Privacy Policy</Text>
            <Icon color="blue.400" as={FiExternalLink} />
          </HStack>
        </Box>
        <Box h="8"></Box>
      </Box>
    </Layout>
  );
}
