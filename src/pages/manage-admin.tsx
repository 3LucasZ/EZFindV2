import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import Admin, { UserProps } from "components/Widget/UserWidget";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Router from "next/router";
import Layout from "components/Layout/Layout";
import SearchView from "components/SearchView";
import { errorToast, successToast } from "services/toasty";
import prisma from "services/prisma";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import Header from "components/Header";
import { poster } from "services/poster";
import UserWidget from "components/Widget/UserWidget";

type PageProps = {
  users: UserProps[];
};
export default function ManageAdmin({ users }: PageProps) {
  const { data: session } = useSession();

  const toaster = useToast();

  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Box minH="8px"></Box>
      <Flex
        px={[2, "5vw", "10vw", "15vw"]}
        textAlign={"center"}
        w="100%"
        flexDir="column"
      >
        <Heading w="100%">Admins</Heading>
        <Text>
          Admins can perform any operation on the app. Only give admin
          priveleges to trusted individuals. You can only see registered users.
        </Text>
      </Flex>
      <Box minH={"8px"} />
      {session?.user.isAdmin && (
        <SearchView
          setIn={users
            .filter((user) => user.isAdmin)
            .map((user) => ({
              name: user.email,
              widget: (
                <UserWidget
                  user={user}
                  key={user.id}
                  mode={-1}
                  handleRemove={async () => {
                    const body = { email: user.email, isAdmin: false };
                    const res = await poster(
                      "/api/update-user-admin",
                      body,
                      toaster
                    );
                    if (res.status == 200) {
                      Router.reload();
                    }
                  }}
                  confirmModal={true}
                />
              ),
            }))}
          setOut={users
            .filter((user) => !user.isAdmin)
            .map((user) => ({
              name: user.email,
              widget: (
                <UserWidget
                  user={user}
                  key={user.id}
                  mode={1}
                  handleAdd={async () => {
                    const body = { email: user.email, isAdmin: true };
                    const res = await poster(
                      "/api/update-user-admin",
                      body,
                      toaster
                    );
                    if (res.status == 200) {
                      Router.reload();
                    }
                  }}
                  confirmModal={true}
                />
              ),
            }))}
          isAdmin={session.user.isAdmin}
          isEdit={false}
        />
      )}
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany();
  return {
    props: { users },
  };
};
