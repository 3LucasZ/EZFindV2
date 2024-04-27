import ItemWidget, { ItemProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { getSession, useSession } from "next-auth/react";
import { UserProps } from "components/Widget/UserWidget";
import Router from "next/router";
import { errorToast } from "services/toasty";
import { Box, useToast, Text, Heading, Center } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";
import { Session } from "next-auth";
import { GroupProps } from "components/Widget/GroupWidget";

type PageProps = {
  group: GroupProps;
};
export default function ManageItems({ group }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Box minH="8px"></Box>
      <Center>
        <Text fontSize={["2xl", "2xl", "2xl", "3xl", "4xl"]}>
          {group.name}: Items
        </Text>
      </Center>
      <Box minH="8px"></Box>
      <SearchView
        setIn={group.items.map((item) => ({
          name: item.name,
          widget: <ItemWidget item={item} key={item.id} />,
        }))}
        onAdd={async () => {
          const body = {
            groupId: group.id,
          };
          const res = await poster("/api/create-item", body, toaster);
          if (res.status == 200)
            await Router.push({ pathname: "/item/" + (await res.json()) });
        }}
        isAdmin={session != null && session.user.isAdmin}
        isEdit={false}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  var groupId = Number(ctx.params?.groupId);
  var group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      items: {
        select: {
          id: true,
          name: true,
          description: true,
          storageRelations: {
            select: {
              count: true,
            },
          },
        },
      },
    },
  });
  return {
    props: { group },
  };
};
