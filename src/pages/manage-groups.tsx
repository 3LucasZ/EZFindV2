import ItemWidget, { ItemProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { getSession, useSession } from "next-auth/react";
import { UserProps } from "components/Widget/UserWidget";
import Router from "next/router";
import { errorToast } from "services/toasty";
import { Box, useToast } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";
import { Session } from "next-auth";
import GroupWidget from "components/Widget/GroupWidget";

type PageProps = {
  groups: ItemProps[];
};
export default function ManageGroups({ groups }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();
  return (
    <Layout isAdmin={isAdmin}>
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
