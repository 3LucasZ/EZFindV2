import {
  Badge,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";
import Router from "next/router";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { StudentProps } from "components/Widget/ItemWidget";
import { MachineProps } from "components/Widget/StorageWidget";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import StudentWidget2 from "components/Widget/StudentWidget2";
import { debugMode } from "services/constants";
type PageProps = {
  machine: MachineProps;
  students: StudentProps[];
  admins: AdminProps[];
};
export default function MachinePage({ machine, students, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //toaster
  const toaster = useToast();
  //inId outId
  const inId = machine.students.map((item) => item.id);
  const outId = students
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: machine.id };
      const res = await fetch("/api/delete-machine", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/manage-machines" });
    } catch (error) {
      if (debugMode) console.error(error);
    }
  };
  //ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Heading>{machine.name}</Heading>
          {isAdmin && (
            <>
              <IconButton
                ml={2}
                mr={2}
                colorScheme="teal"
                aria-label="edit"
                icon={<EditIcon />}
                onClick={() =>
                  Router.push({
                    pathname: "/upsert-machine",
                    query: { id: machine.id },
                  })
                }
              />
              <IconButton
                onClick={onOpen}
                colorScheme="red"
                aria-label="delete"
                icon={<DeleteIcon />}
              />
              <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                name={" the machine: " + machine.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={machine.usedBy ? "green" : "red"}>
            {machine.usedBy ? machine.usedBy.name : "Standby"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var student = students.find((x) => x.id == id);
            if (!student) student = students[0];
            return {
              name: student.name,
              widget: (
                <StudentWidget2
                  student={student}
                  key={student.id}
                  targetmachine={machine}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var student = students.find((x) => x.id == id);
            if (!student) student = students[0];
            return {
              name: student.name,
              widget: (
                <StudentWidget2
                  student={student}
                  key={student.id}
                  targetmachine={machine}
                  invert={true}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          isAdmin={isAdmin}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const machine = await prisma.machine.findUnique({
    where: {
      id: Number(context.params?.machineId),
    },
    include: {
      students: true,
      usedBy: true,
    },
  });
  const students = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      machine: machine,
      students: students,
      admins: admins,
    },
  };
};
