import ItemWidget, { ItemProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget";
import Router from "next/router";
import { errorToast } from "services/toasty";
import { Box, useToast } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";

type PageProps = {
  items: ItemProps[];
  admins: AdminProps[];
};
export default function ManageItems({ items, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  return (
    <Layout isAdmin={isAdmin}>
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
        isAdmin={isAdmin}
        isEdit={false}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const items = await prisma.item.findMany({ include: { relations: true } });
  const admins = await prisma.admin.findMany();
  return {
    props: { items: items, admins: admins },
  };
};
