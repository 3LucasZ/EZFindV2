import { Box, Grid } from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";
import { RelationProps } from "./RelationWidget";

export type ItemProps = {
  id: number;
  name: string;
  description: string;
  relations: RelationProps[];
  image: string;
};
type ItemWidgetProps = {
  item: ItemProps;
};

export default function ItemWidget({ item }: ItemWidgetProps) {
  var sum = 0;
  item.relations.forEach((relation) => (sum += relation.count));
  return (
    <Grid
      templateColumns={["repeat(6, 1fr)", "repeat(6, 1fr)", "repeat(12, 1fr)"]}
      w="100%"
      overflow="hidden"
      rounded="md"
    >
      <BaseWidget
        href={"/item/" + item.id}
        title={item.name}
        bg={"cyan.400"}
        bgHover={"cyan.500"}
        colSpan={6}
      />
      <BaseWidget
        title={item.description}
        bg={"cyan.300"}
        colSpan={6}
        cnt={sum ? sum : -1}
      />
    </Grid>
  );
}
