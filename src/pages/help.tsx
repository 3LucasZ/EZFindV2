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
    <Layout>
      <Header isAdmin={isAdmin} />

      <Box px="5" overflowY="auto">
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
          href="https://www.freeprivacypolicy.com/live/ecbf96ef-5d3a-49e3-a3b1-c4d00ade0934"
          display={"block"}
          fontSize={"xl"}
        >
          Privacy Policy
        </Link>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/f2d9ef3d-0010-4737-84ac-55143be8a3a0"
          display={"block"}
          fontSize={"xl"}
        >
          Terms of Service
        </Link>
        <Text fontSize="4xl">Help</Text>
        <Text fontSize="xl">
          Please do not hesitate to email us at REDACTED if you have any
          questions, need further instruction, or have suggestions for
          improvement.
        </Text>
      </Box>
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
