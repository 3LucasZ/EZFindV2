import StorageWidget from "components/Widget/ShortSearchWidget";
import { StorageProps } from "types/db";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import SearchView from "components/Main/SearchView";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useSession } from "next-auth/react";
import { errorToast } from "services/toasty";
import Router from "next/router";
import { Box, Center, useToast, Text } from "@chakra-ui/react";
import Header from "components/Layout/Header";
import { poster } from "services/poster";
import { GroupProps } from "components/Widget/GroupWidget";
import SearchWidget from "components/Widget/ShortSearchWidget";
import { FAB } from "components/Layout/FAB";
import { FiPlus } from "react-icons/fi";
import { AddIcon } from "@chakra-ui/icons";

type PageProps = {
  group: GroupProps;
};
export default function ManageStorages({ group }: PageProps) {
  const { data: session } = useSession();
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin} group={group}>
      <Box minH="8px"></Box>
      {/* <Center>
        <Text fontSize={["2xl", "2xl", "2xl", "3xl", "4xl"]}>
          {group.name}: Storages
        </Text>
      </Center>
      <Box minH="8px"></Box> */}
      <SearchView
        set={group.storages!.map((storage) => ({
          name: storage.name,
          widget: (
            <SearchWidget
              name={storage.name}
              description={storage.description}
              image={storage.image}
              url={`/storage/${storage.id}`}
              count={storage.itemRelations
                .map((x) => x.count)
                .reduce((sum, a) => sum + a, 0)}
              key={storage.id}
            />
          ),
        }))}
        isEdit={false}
      />
      <FAB
        icon={AddIcon}
        onClick={async () => {
          const body = {
            groupId: group.id,
          };
          const res = await poster("/api/create-storage", body, toaster);
          if (res.status == 200)
            await Router.push({ pathname: "/storage/" + (await res.json()) });
        }}
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
          image: true,
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
