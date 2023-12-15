import ItemWidget, { ItemProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";

type PageProps = {
  items: ItemProps[];
  admins: AdminProps[];
};
export default function ManageItems({ items, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <SearchView
        setIn={items.map((item) => ({
          name: item.name,
          widget: <ItemWidget item={item} key={item.id} />,
        }))}
        onAdd={() => {
          console.log("hi");
        }}
        isAdmin={isAdmin}
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
