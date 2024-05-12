import ItemWidget from "components/Widget/ItemStorageWidget";
import { ItemProps } from "types/db";
import Layout from "components/Layout/MainLayout";
import SearchView from "components/Main/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { getSession, useSession } from "next-auth/react";
import { UserProps } from "components/Widget/UserWidget";
import Router from "next/router";
import { errorToast } from "services/toasty";
import { Box, useToast, Text, Heading, Center } from "@chakra-ui/react";
import Header from "components/Layout/Header";
import { poster } from "services/poster";
import { Session } from "next-auth";
import { GroupProps } from "components/Widget/GroupWidget";
import SearchWidget from "components/Widget/ItemStorageWidget";
import { FAB } from "components/Layout/FAB/FAB";
import { FiPlus } from "react-icons/fi";
import { AddIcon } from "@chakra-ui/icons";
import { getPerms } from "services/utils";

type PageProps = {
  group: GroupProps;
};
export default function ManageItems({ group }: PageProps) {
  //--copy paste on every page--
  const { data: session, status } = useSession();
  const { isAdmin, pagePerm } = getPerms(session?.user, group);
  const toaster = useToast();
  //--ret
  return (
    <Layout isAdmin={isAdmin} group={group}>
      <Box minH="8px"></Box>
      <SearchView
        set={group.items!.map((item) => ({
          name: item.name,
          widget: (
            <SearchWidget
              name={item.name}
              description={item.description}
              image={item.image}
              url={`/item/${item.id}`}
              count={item.storageRelations
                .map((x) => x.count)
                .reduce((sum, a) => sum + a, 0)}
              key={item.id}
            />
          ),
        }))}
        isEdit={false}
      />
      {pagePerm >= 1 && (
        <FAB
          icon={AddIcon}
          onClick={async () => {
            const body = {
              groupId: group.id,
            };
            const res = await poster("/api/create-item", body, toaster);
            if (res.status == 200)
              await Router.push({ pathname: "/item/" + (await res.json()) });
          }}
        />
      )}
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
          image: true,
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
