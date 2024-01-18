import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget";
import Header from "components/Header";
import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

type PageProps = {
  admins: AdminProps[];
};
export default function Home({ admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <Box px="5" overflowY="auto">
        <Text fontSize="4xl">Version</Text>
        <Text fontSize="xl">2.2 (Alpha)</Text>
        <Text fontSize="4xl">Q&A</Text>
        <Text fontSize="xl">
          Q: Why is the website considered unsafe and untrusted by Safari and
          Chrome?
        </Text>
        <Text fontSize="xl">
          A: The website is in the alpha version and running on a local
          development server. Rest assured, your data is safe. Check out our
          privacy policy and terms of service below.
        </Text>
        <Text fontSize="xl">Q: What does the invert checkbox do?</Text>
        <Text fontSize="xl">
          A: When invert mode is on, the display will tell you what items a
          storage does not contain, and what storages an item can not be found
          in.
        </Text>
        <Text fontSize="xl">
          Q: What are the numbers in the different widgets?
        </Text>
        <Text fontSize="xl">
          A: In the manage items page, the number shown is the total stock of
          the item. In the manage storages page, the number shown is the number
          of items contained in that storage. When viewing a specific item, the
          number shown next to each storage is the amount of that item the
          storage contains. When viewing a specific storage, the number shown
          next to each item is the amount of that item the storage contains.
        </Text>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  return {
    props: {
      admins: admins,
    },
  };
};
