import ItemWidget from "components/Widget/ShortSearchWidget";
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
import SearchWidget from "components/Widget/ShortSearchWidget";

type PageProps = {
  group: GroupProps;
};
export default function ManageItems({ group }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin} group={group}>
      <Box minH="8px"></Box>
      {/* <Center>
        <Text fontSize={["2xl", "2xl", "2xl", "3xl", "4xl"]}>
          {group.name}: Items
        </Text>
      </Center> */}
      {/* <Box minH="8px"></Box> */}
      <SearchView
        setIn={group.items!.map((item) => ({
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
