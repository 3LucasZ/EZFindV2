import MachineWidget, { MachineProps } from "components/Widget/MachineWidget";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";

type PageProps = {
  machines: MachineProps[];
  admins: AdminProps[];
};
export default function ManageMachines({ machines, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <SearchView
        setIn={machines.map((machine) => ({
          name: machine.name,
          widget: <MachineWidget machine={machine} key={machine.id} />,
        }))}
        url={"upsert-machine"}
        isAdmin={isAdmin}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const machines = await prisma.machine.findMany({ include: { usedBy: true } });
  const admins = await prisma.admin.findMany();
  return {
    props: { machines: machines, admins: admins },
  };
};
