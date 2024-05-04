import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { RouteButton } from "components/Main/RouteButton";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { FaTools } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { UserProps } from "components/Widget/UserWidget";
import Header from "components/Layout/Header";
import GroupWidget, { GroupProps } from "components/Widget/GroupWidget";
import SearchView from "components/Main/SearchView";
import { poster } from "services/poster";
import Router from "next/router";

type PageProps = {
  groups: GroupProps[];
};

export default function Home({ groups }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Heading py="15" px="2" textAlign={"center"}>
        Welcome to EZFind!
      </Heading>

      <Text textAlign={"center"}>
        Get started by selecting a group to find/add items in.{" "}
      </Text>

      <Box minH="8px"></Box>
      <SearchView
        setIn={groups.map((group) => ({
          name: group.name,
          widget: <GroupWidget group={group} key={group.id} />,
        }))}
        onAdd={async () => {
          const body = JSON.stringify("");
          const res = await poster("/api/create-group", body, toaster);
          if (res.status == 200)
            await Router.push({
              pathname: "/group/" + (await res.json()) + "/explore",
            });
        }}
        isAdmin={isAdmin}
        isEdit={false}
        columns={[2, 3, 3, 4]}
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
