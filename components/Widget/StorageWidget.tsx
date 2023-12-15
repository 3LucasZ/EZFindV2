import { Box, Grid, GridItem, Link } from "@chakra-ui/react";

import { ItemProps } from "./ItemWidget";
import BaseWidget from "./BaseWidget";

export type StorageProps = {
  id: number;
  name: string;
  items: ItemProps[];
  lastSeen?: string;
  usedBy?: ItemProps;
  IP?: string;
};
type StorageWidgetProps = {
  storage: StorageProps;
  bare?: boolean;
};

export default function StorageWidget({ storage, bare }: StorageWidgetProps) {
  return (
    <Box display="flex" position="relative">
      <Grid templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} w="100%">
        <BaseWidget
          href={"/storage/" + storage.id}
          title={storage.name}
          bg={"blue.300"}
          colSpan={bare ? 4 : 2}
        />
        {!bare && (
          <>
            <BaseWidget
              href={storage.usedBy ? "/item/" + storage.usedBy.id : ""}
              title={storage.usedBy ? storage.usedBy.name : "Standby"}
              bg={storage.usedBy ? "teal.300" : "red.300"}
              colSpan={1}
            />
            <BaseWidget
              href={""}
              title={storage.IP ? storage.IP : "Not seen"}
              bg={storage.IP ? "orange.300" : "red.400"}
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
