import { Box, Grid } from "@chakra-ui/react";
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
  var sum = 0;
  item.relations.forEach((relation) => (sum += relation.count));
  return (
    <Box display="flex" position="relative">
      <Grid
        templateColumns={[
          "repeat(6, 1fr)",
          "repeat(6, 1fr)",
          "repeat(12, 1fr)",
          "repeat(12, 1fr)",
        ]}
        w="100%"
      >
        <BaseWidget
          href={"/item/" + item.id}
          title={item.name}
          bg={"cyan.400"}
          bgHover={"cyan.500"}
          colSpan={6}
        />
        <BaseWidget title={item.description} bg={"cyan.300"} colSpan={4} />
        <BaseWidget title={"" + sum} bg={"cyan.200"} colSpan={2} />
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
