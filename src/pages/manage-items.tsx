import ItemWidget, { ItemProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { getSession, useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { UserProps } from "components/Widget/UserWidget";
import Router from "next/router";
import { errorToast } from "services/toasty";
import { Box, useToast } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";
import { Session } from "next-auth";

type PageProps = {
  items: ItemProps[];
};
export default function ManageItems({ items }: PageProps) {
  const { data: session } = useSession();

  const toaster = useToast();
  return (
    <Layout isAdmin={session != null && session.user.isAdmin}>
      <Box minH="8px"></Box>
      <SearchView
        setIn={items.map((item) => ({
          name: item.name,
          widget: <ItemWidget item={item} key={item.id} />,
        }))}
        onAdd={async () => {
          const body = JSON.stringify("");
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
  var items = await prisma.item.findMany({ include: { relations: true } });
  items.forEach((item) => (item.image = "")); //(experimental) remove image from items to reduce payload???
  //const session = await getSession(ctx); //getSession in ServerSideProps takes over 10 seconds

  return {
    props: { items },
  };
};
