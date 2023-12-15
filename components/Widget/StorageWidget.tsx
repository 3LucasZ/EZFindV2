import { Box, Grid, GridItem, Link } from "@chakra-ui/react";

import { StudentProps } from "./ItemWidget";
import BaseWidget from "./BaseWidget";

export type MachineProps = {
  id: number;
  name: string;
  students: StudentProps[];
  lastSeen?: string;
  usedBy?: StudentProps;
  IP?: string;
};
type MachineWidgetProps = {
  machine: MachineProps;
  bare?: boolean;
};

export default function MachineWidget({ machine, bare }: MachineWidgetProps) {
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} w="100%">
        <BaseWidget
          href={"/machine/" + machine.id}
          title={machine.name}
          bg={"blue.300"}
          colSpan={bare ? 4 : 2}
        />
        {!bare && (
          <>
            <BaseWidget
              href={machine.usedBy ? "/student/" + machine.usedBy.id : ""}
              title={machine.usedBy ? machine.usedBy.name : "Standby"}
              bg={machine.usedBy ? "teal.300" : "red.300"}
              colSpan={1}
            />
            <BaseWidget
              href={""}
              title={machine.IP ? machine.IP : "Not seen"}
              bg={machine.IP ? "orange.300" : "red.400"}
              colSpan={1}
            />
          </>
        )}
      </Grid>
      <Box
        position="absolute"
        w="100%"
        h="100%"
        border="1px solid white"
        borderRadius={"md"}
        outline="2px solid white"
      ></Box>
    </Box>
  );
}
