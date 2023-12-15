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
import { StudentProps } from "components/Widget/StudentWidget";
import { GetServerSideProps } from "next";
import { MachineProps } from "components/Widget/MachineWidget";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import MachineWidget2 from "components/Widget/MachineWidget2";
import { debugMode } from "services/constants";

type PageProps = {
  student: StudentProps;
  machines: MachineProps[];
  admins: AdminProps[];
};

export default function StudentPage({ student, machines, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //toaster
  const toaster = useToast();
  //inId and outId
  const inId = student.machines.map((item) => item.id);
  const outId = machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  // delete modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: student.id };
      const res = await fetch("/api/delete-student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/manage-students" });
    } catch (error) {
      if (debugMode) console.error(error);
    }
  };
  // ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Heading>{student.name}</Heading>
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
                    pathname: "/upsert-student",
                    query: { id: student.id },
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
                name={" the student: " + student.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={student.using ? "green" : "red"}>
            {student.using ? student.using.name : "Offline"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var machine = machines.find((x) => x.id == id);
            if (!machine) machine = machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget2
                  machine={machine}
                  key={machine.id}
                  targetStudent={student}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var machine = machines.find((x) => x.id == id);
            if (!machine) machine = machines[0];
            return {
              name: machine.name,
              widget: (
                <MachineWidget2
                  machine={machine}
                  key={machine.id}
                  targetStudent={student}
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
  const student = await prisma.student.findUnique({
    where: {
      id: Number(context.params?.studentId),
    },
    include: {
      machines: true,
      using: true,
    },
  });
  const machines = await prisma.machine.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      student: student,
      machines: machines,
      admins: admins,
    },
  };
};
