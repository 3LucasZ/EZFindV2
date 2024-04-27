import { Box, Grid } from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";
import { ItemStorageRelationProps } from "./ItemStorageRelationWidget";

export type StorageProps = {
  id: number;
  name: string;
  description: string;
  itemRelations: ItemStorageRelationProps[];
  image: string;
};
type StorageWidgetProps = {
  storage: StorageProps;
};

export default function StorageWidget({ storage }: StorageWidgetProps) {
  var sum = 0;
  storage.itemRelations.forEach((relation) => (sum += relation.count));
  return (
    <Box display="flex">
      <Grid
        templateColumns={[
          "repeat(6, 1fr)",
          "repeat(6, 1fr)",
          "repeat(12, 1fr)",
          "repeat(12, 1fr)",
        ]}
        w="100%"
        overflow="hidden"
        rounded="md"
      >
        <BaseWidget
          href={"/storage/" + storage.id}
          title={storage.name}
          bg={"blue.400"}
          bgHover={"blue.500"}
          colSpan={6}
        />
        <BaseWidget
          title={storage.description}
          bg={"blue.300"}
          colSpan={6}
          cnt={sum ? sum : -1}
        />
      </Grid>
    </Box>
  );
}
