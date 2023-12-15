import { SimpleGrid } from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";

type PageProps = {
  admins: AdminProps[];
};
export default function Home({ admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <SimpleGrid
        columns={[1, 2]}
        spacing={10}
        overflowY="auto"
        w="100svw"
        h={"100%"}
        top={"50%"}
        pb="10"
      >
        {/* {session && admins.includes(session!.user!.email!) && (
          <RouteButton
            route={""}
            text={"machine Status"}
            icon={MdManageAccounts}
            color={"red.400"}
            hoverColor={"red.100"}
          ></RouteButton>
        )} */}
        <RouteButton
          route={"manage-students"}
          text={"Manage Students"}
          icon={MdManageAccounts}
          color={"teal.300"}
          hoverColor={"teal.100"}
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
          route={"manage-machines"}
          text={"Manage Machines"}
          icon={GiSewingMachine}
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
