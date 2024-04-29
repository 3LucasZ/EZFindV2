import StorageWidget, { StorageProps } from "components/Widget/StorageWidget";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useSession } from "next-auth/react";
import { errorToast } from "services/toasty";
import Router from "next/router";
import { Box, Center, useToast, Text } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";
import { GroupProps } from "components/Widget/GroupWidget";

type PageProps = {
  group: GroupProps;
};
export default function ManageStorages({ group }: PageProps) {
  const { data: session } = useSession();
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Box minH="8px"></Box>
      <Center>
        <Text fontSize={["2xl", "2xl", "2xl", "3xl", "4xl"]}>
          {group.name}: Storages
        </Text>
      </Center>
      <Box minH="8px"></Box>
      <SearchView
        setIn={group.storages!.map((storage) => ({
          name: storage.name,
          widget: <StorageWidget storage={storage} key={storage.id} />,
        }))}
        onAdd={async () => {
          const body = {
            groupId: group.id,
          };
          const res = await poster("/api/create-storage", body, toaster);
          if (res.status == 200)
            await Router.push({ pathname: "/storage/" + (await res.json()) });
        }}
        isAdmin={session?.user.isAdmin}
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
      storages: {
        select: {
          id: true,
          name: true,
          description: true,
          itemRelations: {
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
