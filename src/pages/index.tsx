import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { FaTools } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { UserProps } from "components/Widget/UserWidget";
import Header from "components/Header";
import GroupWidget, { GroupProps } from "components/Widget/GroupWidget";
import SearchView from "components/SearchView";
import { poster } from "services/poster";

type PageProps = {
  groups: GroupProps[];
};

export default function Home({ groups }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Center>
        <Heading py="15">Welcome to EZFind!</Heading>
      </Center>
      <Center>
        <Text>Get started by selecting a group to find/add items in. </Text>
      </Center>
      <Box minH="8px"></Box>
      <SearchView
        setIn={groups.map((group) => ({
          name: group.name,
          widget: <GroupWidget group={group} key={group.id} />,
        }))}
        onAdd={async () => {
          const body = JSON.stringify("");
          const res = await poster("/api/create-group", body, toaster);
          // if (res.status == 200)
          //   await Router.push({ pathname: "/group/" + (await res.json()) });
        }}
        isAdmin={isAdmin}
        isEdit={false}
        columns={4}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  var groups = await prisma.group.findMany();
  return {
    props: { groups },
  };
};
