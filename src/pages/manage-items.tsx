import StudentWidget, { StudentProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";

type PageProps = {
  students: StudentProps[];
  admins: AdminProps[];
};
export default function ManageStudents({ students, admins }: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  return (
    <Layout isAdmin={isAdmin}>
      <SearchView
        setIn={students.map((student) => ({
          name: student.name,
          widget: <StudentWidget student={student} key={student.id} />,
        }))}
        url={"upsert-student"}
        isAdmin={isAdmin}
      />
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const students = await prisma.student.findMany({ include: { using: true } });
  const admins = await prisma.admin.findMany();
  return {
    props: { students: students, admins: admins },
  };
};
