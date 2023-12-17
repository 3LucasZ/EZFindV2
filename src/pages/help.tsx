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

      <Box px="5">
        <Heading>Dymo Instructions</Heading>
        <Text>In order to have dymo printing functionality:</Text>
        <UnorderedList>
          <ListItem>
            Install the official Dymo Connect SDK for Mac or Windows from:
            https://www.dymo.com/support?cfid=online-support-sdk
          </ListItem>
          <ListItem>
            Accept/allow any changes the SDK wants to make on your device
          </ListItem>
        </UnorderedList>
        <Text>Make sure:</Text>
        <UnorderedList>
          <ListItem>Dymo Connect Service is running on your computer</ListItem>
          <ListItem>
            Service port is at 41951 (default) Connected to a printer via USB
            Dymo
          </ListItem>
          <ListItem>Certificate is trusted</ListItem>
        </UnorderedList>{" "}
        <Heading>Documents</Heading>
        <UnorderedList>
          <ListItem>
            <Link
              color="teal.500"
              href="https://www.freeprivacypolicy.com/live/ecbf96ef-5d3a-49e3-a3b1-c4d00ade0934"
            >
              Privacy Policy
            </Link>
          </ListItem>
          <ListItem>
            <Link
              color="teal.500"
              href="https://www.freeprivacypolicy.com/live/f2d9ef3d-0010-4737-84ac-55143be8a3a0"
            >
              Terms of Service
            </Link>
          </ListItem>
        </UnorderedList>
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
