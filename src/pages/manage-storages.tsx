import StorageWidget, { StorageProps } from "components/Widget/StorageWidget";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { errorToast } from "services/toasty";
import Router from "next/router";
import { useToast } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";

type PageProps = {
  storages: StorageProps[];
  admins: AdminProps[];
};
export default function ManageStorages({ storages, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  return (
    <Layout>
      <Header isAdmin={isAdmin} />
      <SearchView
        setIn={storages.map((storage) => ({
          name: storage.name,
          widget: <StorageWidget storage={storage} key={storage.id} />,
        }))}
        onAdd={async () => {
          const body = JSON.stringify("");
          const res = await poster("/api/create-storage", body, toaster);
          if (res.status == 200)
            await Router.push({ pathname: "/storage/" + (await res.json()) });
        }}
        isAdmin={isAdmin}
        isEdit={false}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const storages = await prisma.storage.findMany({
    include: { relations: true },
  });
  const admins = await prisma.admin.findMany();
  return {
    props: { storages: storages, admins: admins },
  };
};
