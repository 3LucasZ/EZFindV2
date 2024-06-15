import { Box, Heading, Text, useToast } from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import GroupWidget from "components/Widget/GroupWidget";
import { GroupProps } from "@/db";
import SearchView from "components/Main/SearchView";
import { poster } from "services/poster";
import Router from "next/router";
import { FAB } from "components/Layout/FAB/FAB";
import { AddIcon } from "@chakra-ui/icons";
import { responsiveHeaderFontSize, responsivePx } from "services/constants";
import { useEffect } from "react";
import PWAPrompt from "components/PWAPrompt";
import { getGroupPerm } from "services/utils";

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
  console.log("admin", me?.isAdmin);
  //--ret--
  return (
    <Layout
      me={me}
      loaded={status !== "loading"}
      authorized={true}
      noAppBar={false}
    >
      <Box px={responsivePx}>
        {!me ? (
          <>
            <Heading py="1" textAlign={"center"}>
              Welcome!
            </Heading>
            <Text textAlign={"center"}>Get started by selecting a group.</Text>
          </>
        ) : (
          <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
            Groups
          </Text>
        )}
      </Box>
      {/* <Box minH="8px"></Box> */}
      <SearchView
        set={groups.map((group) => ({
          name: -getGroupPerm(me, group) + group.name, //sort1: most perm, sort2: name
          widget: (
            <GroupWidget
              group={group}
              key={group.id}
              authorized={getGroupPerm(me, group) >= 0}
            />
          ),
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
        hidden={!me?.isAdmin}
      />
      <PWAPrompt />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  var groups = await prisma.group.findMany();
  return {
    props: { groups },
  };
};
