import {
  Box,
  Grid,
  HStack,
  Image,
  VStack,
  Text,
  AspectRatio,
  Stack,
} from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";
import { ItemStorageRelationProps } from "./ItemStorageRelationWidget";
import { GroupProps } from "./GroupWidget";
import Router from "next/router";
import { genGradient } from "services/gradientGenerator";
import { count } from "console";
import EditableCounter from "components/Minis/EditableCounter";

export type ItemProps = {
  id: number;
  name: string;
  description: string;
  storageRelations: ItemStorageRelationProps[];
  image: string;
  link: string;
  group: GroupProps;
};
type ItemWidgetProps = {
  item: ItemProps;
};

export default function ItemWidget({ item }: ItemWidgetProps) {
  var sum = 0;
  item.storageRelations.forEach((relation) => (sum += relation.count));
  return (
    <Box
      // templateColumns={["repeat(6, 1fr)", "repeat(6, 1fr)", "repeat(12, 1fr)"]}
      overflow="hidden"
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => Router.push("/item/" + item.id)}
    >
      <HStack w="100%">
        <AspectRatio width="50px" ratio={1} bgGradient={genGradient(item.name)}>
          <Image
            src={`/api/${item.image}`}
            hidden={item.image.length < 5}
          ></Image>
        </AspectRatio>
        <Stack direction="row" w="100%">
          <Stack direction="row" w="100%">
            <Text
              w="40%"
              noOfLines={1}
              wordBreak={"break-all"}
              verticalAlign={"center"}
            >
              {item.name}
            </Text>
            <Text w="60%" noOfLines={1} wordBreak={"break-all"}>
              {item.description ? item.description : "No description."}
            </Text>
          </Stack>
          <EditableCounter count={sum} isDisabled={true} />
        </Stack>
      </HStack>
    </Box>
  );
}
/*
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
      */
