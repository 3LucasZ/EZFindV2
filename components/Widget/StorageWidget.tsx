import { Box, Grid, GridItem, Link } from "@chakra-ui/react";

import { ItemProps } from "./ItemWidget";
import BaseWidget from "./BaseWidget";
import { RelationProps } from "./RelationWidget";

export type StorageProps = {
  id: number;
  name: string;
  description: string;
  relations: RelationProps[];
};
type StorageWidgetProps = {
  storage: StorageProps;
};

export default function StorageWidget({ storage }: StorageWidgetProps) {
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} w="100%">
        <BaseWidget
          href={"/storage/" + storage.id}
          title={storage.name}
          bg={"blue.300"}
          colSpan={2}
        />
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
