import { Box, Grid } from "@chakra-ui/react";
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
  var sum = 0;
  storage.relations.forEach((relation) => (sum += relation.count));
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
        <BaseWidget title={storage.description} bg={"blue.300"} colSpan={4} />
        <BaseWidget title={"" + sum} bg={"blue.200"} colSpan={2} />
      </Grid>
    </Box>
  );
}
