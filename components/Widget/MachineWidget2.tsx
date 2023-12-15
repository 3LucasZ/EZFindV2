import { MachineProps } from "./MachineWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { StudentProps } from "./StudentWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { errorToast, successToast } from "services/toasty";

type MachineWidget2Props = {
  machine: MachineProps;
  targetStudent: StudentProps;
  invert: boolean;
  isAdmin: boolean;
};

export default function MachineWidget2({
  machine,
  targetStudent,
  invert,
  isAdmin,
}: MachineWidget2Props) {
  const toaster = useToast();
  const handleRemove = async () => {
    try {
      const body = {
        id: targetStudent.id,
        name: targetStudent.name,
        PIN: targetStudent.PIN,
        machineIds: targetStudent.machines
          .filter((item) => item.id != machine.id)
          .map((item) => ({ id: item.id })),
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + machine.id);
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  const handleAdd = async () => {
    try {
      const machineIds = targetStudent.machines.map((item) => ({
        id: item.id,
      }));
      machineIds.push({ id: machine.id });
      const body = {
        id: targetStudent.id,
        name: targetStudent.name,
        PIN: targetStudent.PIN,
        machineIds,
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + machine.id);
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  return (
    <BaseWidget2
      href={"/machine/" + machine.id}
      title={machine.name}
      bg={"blue.300"}
      handleRemove={handleRemove}
      safeRemove={false}
      handleAdd={handleAdd}
      invert={invert}
      isAdmin={isAdmin}
    />
  );
}
