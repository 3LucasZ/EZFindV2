import StorageWidget, { StorageProps } from "components/Widget/StorageWidget";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useSession } from "next-auth/react";
import { errorToast } from "services/toasty";
import Router from "next/router";
import { Box, useToast } from "@chakra-ui/react";
import Header from "components/Header";
import { poster } from "services/poster";

type PageProps = {
  storages: StorageProps[];
};
export default function ManageStorages({ storages }: PageProps) {
  const { data: session } = useSession();
  const toaster = useToast();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Box minH="8px"></Box>
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
        isAdmin={session?.user.isAdmin}
        isEdit={false}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const storages = await prisma.storage.findMany({
    include: { relations: true },
  });
  return {
    props: { storages },
  };
};
