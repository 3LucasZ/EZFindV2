import { SimpleGrid } from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { FaTools } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { UserProps } from "components/Widget/UserWidget";
import Header from "components/Header";

type PageProps = {
  admins: UserProps[];
};
export default function Home({ admins }: PageProps) {
  const { data: session } = useSession();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <SimpleGrid
        columns={[1, 2]}
        overflowY="auto"
        w="100svw"
        h={"100%"}
        position={"fixed"}
        py={16}
        top={"0%"}
        zIndex={-100}
      >
        {/* {session && admins.includes(session!.user!.email!) && (
          <RouteButton
            route={""}
            text={"storage Status"}
            icon={MdManageAccounts}
            color={"red.400"}
            hoverColor={"red.100"}
          ></RouteButton>
        )} */}
        <RouteButton
          route={"manage-items"}
          text={"Items"}
          icon={FaTools}
          color={"cyan.300"}
          hoverColor={"cyan.100"}
        ></RouteButton>
        {/* {session && admins.includes(session!.user!.email!) && (
          <RouteButton
            route={""}
            text={"View Logs"}
            icon={IoDocumentText}
            color={"orange.400"}
            hoverColor={"orange.100"}
          ></RouteButton>
        )} */}
        <RouteButton
          route={"manage-storages"}
          text={"Storages"}
          icon={FaBoxes}
          color={"blue.300"}
          hoverColor={"blue.100"}
        ></RouteButton>
      </SimpleGrid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const admins = await prisma.admin.findMany();
  return {
    props: {
      admins: admins,
    },
  };
};
