import ItemWidget, { ItemProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import Router from "next/router";
import { errorToast } from "services/toasty";
import { useToast } from "@chakra-ui/react";
import Header from "components/Header";

type PageProps = {
  items: ItemProps[];
  admins: AdminProps[];
};
export default function ManageItems({ items, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  return (
    <Layout>
      <Header isAdmin={isAdmin} />
      <SearchView
        setIn={items.map((item) => ({
          name: item.name,
          widget: <ItemWidget item={item} key={item.id} />,
        }))}
        onAdd={async () => {
          try {
            const res = await fetch("/api/create-item", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(""),
            });
            await Router.push({ pathname: "/item/" + (await res.json()) });
          } catch (error) {
            errorToast(toaster, "" + error);
          }
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
