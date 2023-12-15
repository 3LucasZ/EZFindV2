import { Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { MachineProps } from "./MachineWidget";
import BaseWidget from "./BaseWidget";

export type StudentProps = {
  id: number;
  name: string;
  PIN: string;
  machines: MachineProps[];
  using: MachineProps;
};
type StudentWidgetProps = {
  student: StudentProps;
  bare?: boolean;
};

export default function StudentWidgetProps({
  student,
  bare,
}: StudentWidgetProps) {
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)"]} w="100%">
        <BaseWidget
          href={"/student/" + student.id}
          title={student.name}
          bg={"teal.300"}
          colSpan={bare ? 2 : 1}
        />
        {!bare && (
          <BaseWidget
            href={student.using ? "/machine/" + student.using.id : ""}
            title={student.using ? student.using.name : "Offline"}
            bg={student.using ? "blue.300" : "red.300"}
            colSpan={1}
          />
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
