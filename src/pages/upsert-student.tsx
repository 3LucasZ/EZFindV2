import React, { useState } from "react";
import Router from "next/router";
import { MultiValue } from "chakra-react-select";
import {
  FormControl,
  Input,
  Button,
  useToast,
  HStack,
  PinInput,
  PinInputField,
  FormLabel,
  Box,
  Flex,
} from "@chakra-ui/react";
import { MachineProps } from "components/Widget/StorageWidget";
import { GetServerSideProps } from "next";
import { StudentProps } from "components/Widget/ItemWidget";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { errorToast, successToast } from "services/toasty";
import { AdminProps } from "components/Widget/AdminWidget2";
import { useSession } from "next-auth/react";
import { checkAdmin } from "services/checkAdmin";
import { debugMode } from "services/constants";

enum FormState {
  Input,
  Submitting,
}
type PageProps = {
  allmachines: MachineProps[];
  oldStudent: StudentProps;
  admins: AdminProps[];
};
type RelateProps = {
  id: number;
};

export default function UpsertStudent({
  allmachines,
  oldStudent,
  admins,
}: PageProps) {
  const { data: session } = useSession();
  const isAdmin = checkAdmin(session, admins);
  const toaster = useToast();
  const allOptions = allmachines.map((machine) => ({
    value: machine.id,
    label: machine.name,
  }));
  const prefillOptions = oldStudent.machines.map((machine) => ({
    value: machine.id,
    label: machine.name,
  }));

  const id = oldStudent.id;
  const isNew = id == -1;
  const PINLen = 10;
  const [name, setName] = useState(oldStudent.name);
  const [PIN, setPIN] = useState(oldStudent.PIN);
  const [machines, setmachines] =
    useState<MultiValue<{ value: number; label: string }>>(prefillOptions);
  const [formState, setFormState] = useState(FormState.Input);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormState(FormState.Submitting);
    try {
      const machineIds: RelateProps[] = [];
      machines.map((obj) => machineIds.push({ id: obj.value }));
      const body = { id, name, PIN, machineIds };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        setFormState(FormState.Input);
        errorToast(toaster, await res.json());
        return;
      } else {
        setFormState(FormState.Input);
        successToast(toaster, "Success!");
        await Router.push(isNew ? "manage-students" : "student/" + id);
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
          <FormLabel>Student Name</FormLabel>
          <Input
            required
            value={name}
            variant="filled"
            placeholder="Name"
            isDisabled={formState === FormState.Input ? false : true}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>PIN</FormLabel>
          <HStack>
            <PinInput onChange={(e) => setPIN(e)} value={PIN}>
              {Array.from(Array(PINLen).keys()).map((key) =>
                key == 0 ? (
                  <PinInputField key={key} required />
                ) : (
                  <PinInputField key={key} />
                )
              )}
            </PinInput>
          </HStack>
        </FormControl>
        {/* <FormControl>
          <FormLabel>Allowed machines</FormLabel>
          <Select
            isMulti
            name="machines"
            options={allOptions}
            value={machines}
            placeholder="Select machines"
            closeMenuOnSelect={false}
            onChange={(e) => setmachines(e)}
            size="lg"
            menuPosition="fixed"
            menuPlacement="top"
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
            {isNew ? "Add Student" : "Update Student"}
          </Button>
        )}
      </Flex>
      <Box h={"150px"}></Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const allmachines = await prisma.machine.findMany();
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.student.findUnique({
    where: {
      id: realId,
    },
    include: {
      machines: true,
    },
  });
  const oldStudent =
    find == null ? { id: -1, name: "", PIN: "", machines: [] } : find;
  //ret
  return {
    props: {
      allmachines: allmachines,
      oldStudent: oldStudent,
      admins: admins,
    },
  };
};
