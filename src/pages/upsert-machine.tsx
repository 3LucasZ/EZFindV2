import React, { useState } from "react";
import Router from "next/router";
import { MultiValue } from "chakra-react-select";
import {
  FormControl,
  Input,
  Button,
  useToast,
  FormLabel,
  Flex,
  Box,
} from "@chakra-ui/react";
import { MachineProps } from "components/Widget/MachineWidget";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/StudentWidget";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { errorToast, successToast } from "services/toasty";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";

enum FormState {
  Input,
  Submitting,
}
type PageProps = {
  allStudents: StudentProps[];
  oldmachine: MachineProps;
  admins: AdminProps[];
};
type RelateProps = {
  id: number;
};
export default function UpsertMachine({
  allStudents,
  oldmachine,
  admins,
}: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  const allOptions = allStudents.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  const prefillOptions = oldmachine.students.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  const id = oldmachine.id;
  const isNew = id == -1;
  const [name, setName] = useState<string>(isNew ? "" : oldmachine.name);
  const [formState, setFormState] = useState(FormState.Input);
  const [students, setStudents] = useState<
    MultiValue<{ value: number; label: string }>
  >(isNew ? [] : prefillOptions);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormState(FormState.Submitting);
    try {
      const studentIds: RelateProps[] = [];
      students.map((obj) => studentIds.push({ id: obj.value }));
      const body = { id, name, studentIds };
      const res = await fetch("/api/upsert-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        setFormState(FormState.Input);
        errorToast(toaster, await res.json());
      } else {
        setFormState(FormState.Input);
        successToast(toaster, "Success!");
        await Router.push(isNew ? "manage-machines" : "machine/" + id);
      }
    } catch (error) {
      setFormState(FormState.Input);
      errorToast(toaster, "" + error);
    }
  };
  return (
    <Layout isAdmin={isAdmin}>
      <Flex
        flexDir="column"
        gap="10"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        h="100%"
      >
        <FormControl isRequired>
          <FormLabel>machine Name</FormLabel>
          <Input
            value={name}
            variant="filled"
            placeholder="Name"
            isDisabled={formState === FormState.Input ? false : true}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        {/* <FormControl>
            <FormLabel>Authorized Students</FormLabel>
            <Select
              isMulti
              name="students"
              options={allOptions}
              value={students}
              placeholder="Select Students"
              closeMenuOnSelect={false}
              onChange={(e) => setStudents(e)}
              size="lg"
              menuPosition="fixed"
            />
          </FormControl> */}
        {isAdmin && (
          <Button
            size="lg"
            colorScheme="teal"
            type="submit"
            isLoading={formState == FormState.Input ? false : true}
            onClick={submitData}
          >
            {isNew ? "Add machine" : "Update machine"}
          </Button>
        )}
      </Flex>
      <Box h={"150px"}></Box>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const allStudents = await prisma.student.findMany();
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.machine.findUnique({
    where: {
      id: realId,
    },
    include: {
      students: true,
    },
  });
  const oldmachine = find == null ? { id: -1, name: "", students: [] } : find;
  //ret
  return {
    props: {
      allStudents: allStudents,
      oldmachine: oldmachine,
      admins: admins,
    },
  };
};
