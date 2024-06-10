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
import { UserProps } from "types/db";
import Header from "components/Layout/Header";
import GroupWidget, { GroupProps } from "components/Widget/GroupWidget";
import SearchView from "components/Main/SearchView";
import { poster } from "services/poster";
import Router from "next/router";
import { FAB } from "components/Layout/FAB/FAB";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { AddIcon } from "@chakra-ui/icons";
import { responsivePx } from "services/constants";
import { useEffect } from "react";

type PageProps = {
  groups: GroupProps[];
};

export default function Home({ groups }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--ret--
  return (
    <Layout me={me} loaded={status !== "loading"} authorized={true}>
      <Box px={responsivePx}>
        <Heading py="1" textAlign={"center"}>
          Welcome!
        </Heading>
        <Text textAlign={"center"}>
          Get started by selecting a group to view.
        </Text>
      </Box>

      <Box minH="8px"></Box>
      <SearchView
        set={groups.map((group) => ({
          name: group.name,
          widget: <GroupWidget group={group} key={group.id} />,
        }))}
        columns={[2, 3, 3, 4]}
      />
      <FAB
        // name="Create"
        icon={AddIcon}
        onClick={async () => {
          const body = JSON.stringify("");
          const res = await poster("/api/create-group", body, toaster);
          if (res.status == 200)
            await Router.push({
              pathname: "/group/" + (await res.json()) + "/explore",
            });
        }}
        hidden={me?.isAdmin == false}
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
