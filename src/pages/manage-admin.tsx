import { Box, Flex, Text, useToast } from "@chakra-ui/react";

import Layout from "components/Layout/MainLayout";
import SearchView from "components/Main/SearchView";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";
import { poster } from "services/poster";
import prisma from "services/prisma";

import UserWidget from "components/Widget/UserWidget";
import { User } from "next-auth";
import { responsiveHeaderFontSize, responsivePx } from "services/constants";

type PageProps = {
  users: User[];
};
export default function ManageAdmin({ users }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--ret--
  return (
    <Layout
      me={me}
      loaded={status !== "loading"}
      authorized={me?.isAdmin}
      noAppBar
    >
      <Box minH="8px"></Box>
      <Flex px={responsivePx} textAlign={"center"} w="100%" flexDir="column">
        <Text w="100%" fontSize={responsiveHeaderFontSize}>
          Admins
        </Text>
        {/* <Text color="grey" textAlign={"start"}>
          Admins can perform any operation on the app. Be cautious to only give
          admin priveleges to trusted individuals. You can only grant admin
          access to pre-registered users.
        </Text> */}
      </Flex>

      {session?.user.isAdmin && (
        <SearchView
          set={users.map((user) => ({
            name: user.email,
            inverted: !user.isAdmin,
            widget: (
              <UserWidget
                //data
                name={user.name}
                email={user.email}
                image={user.image}
                isAdmin={user.isAdmin}
                key={user.id}
                //state
                inverted={!user.isAdmin}
                isEdit={true}
                //functions
                askConfirmation={true}
                handleAdd={async () => {
                  const body = { email: user.email, isAdmin: true };
                  const res = await poster(
                    "/api/update-user-admin",
                    body,
                    toaster
                  );
                  if (res.status == 200) {
                    Router.push("/manage-admin");
                  }
                }}
                handleRemove={async () => {
                  const body = { email: user.email, isAdmin: false };
                  const res = await poster(
                    "/api/update-user-admin",
                    body,
                    toaster
                  );
                  if (res.status == 200) {
                    Router.push("/manage-admin");
                  }
                }}
              />
            ),
          }))}
          invertible={true}
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
