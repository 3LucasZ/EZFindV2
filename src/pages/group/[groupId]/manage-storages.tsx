import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import SearchView from "components/Main/SearchView";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { Box, useToast, Text } from "@chakra-ui/react";
import { poster } from "services/poster";
import { GroupProps } from "components/Widget/GroupWidget";
import SearchWidget from "components/Widget/ItemStorageWidget";
import { FAB } from "components/Layout/FAB/FAB";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { getGroupPerm } from "services/utils";
import { responsiveHeaderFontSize } from "services/constants";

type PageProps = {
  group: GroupProps;
};
export default function ManageStorages({ group }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const groupPerm = getGroupPerm(me, group);
  //--ret--
  return (
    <Layout
      me={me}
      group={group}
      authorized={groupPerm >= 0}
      loaded={status !== "loading"}
    >
      <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
        Storages
      </Text>
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
