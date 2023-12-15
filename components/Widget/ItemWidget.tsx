import { Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { StorageProps } from "./StorageWidget";
import BaseWidget from "./BaseWidget";
import { RelationProps } from "./RelationWidget";

export type ItemProps = {
  id: number;
  name: string;
  description: string;
  relations: RelationProps[];
};
type ItemWidgetProps = {
  item: ItemProps;
};

export default function ItemWidgetProps({ item }: ItemWidgetProps) {
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)"]} w="100%">
        <BaseWidget
          href={"/item/" + item.id}
          title={item.name}
          bg={"teal.300"}
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
