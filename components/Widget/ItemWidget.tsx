import { Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { StorageProps } from "./StorageWidget";
import BaseWidget from "./BaseWidget";

export type ItemProps = {
  id: number;
  name: string;
  PIN: string;
  storages: StorageProps[];
  using: StorageProps;
};
type ItemWidgetProps = {
  item: ItemProps;
  bare?: boolean;
};

export default function ItemWidgetProps({ item, bare }: ItemWidgetProps) {
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)"]} w="100%">
        <BaseWidget
          href={"/item/" + item.id}
          title={item.name}
          bg={"teal.300"}
          colSpan={bare ? 2 : 1}
        />
        {!bare && (
          <BaseWidget
            href={item.using ? "/storage/" + item.using.id : ""}
            title={item.using ? item.using.name : "Offline"}
            bg={item.using ? "blue.300" : "red.300"}
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
