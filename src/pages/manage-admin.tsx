import { Box, Flex, IconButton, Input, useToast } from "@chakra-ui/react";
import Admin, { AdminProps } from "components/Widget/AdminWidget2";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { errorToast, successToast } from "services/toasty";
import prisma from "services/prisma";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import Header from "components/Header";

type PageProps = {
  admins: AdminProps[];
};
export default function ManageAdmin({ admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const [email, setEmail] = useState("");
  const toaster = useToast();

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { email };
      const res = await fetch("/api/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, await res.json());
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  return (
    <Layout>
      <Header isAdmin={isAdmin} />
      <Flex px={[2, "5vw", "10vw", "15vw"]} gap={2}>
        <Input
          variant="filled"
          placeholder="Admin email"
          value={email}
          onChange={handleCreateChange}
        />
        {isAdmin && (
          <IconButton
            p={0}
            ml={2}
            mr={2}
            colorScheme="teal"
            aria-label="edit"
            icon={<AddIcon />}
            onClick={submitData}
          />
        )}
      </Flex>
      <Box h={2} />
      {isAdmin && (
        <SearchView
          setIn={admins.map((admin) => ({
            name: admin.email,
            widget: <Admin admin={admin} key={admin.id} />,
          }))}
          isAdmin={isAdmin}
        />
      )}
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const admins = await prisma.admin.findMany();
  return {
    props: { admins: admins },
  };
};
