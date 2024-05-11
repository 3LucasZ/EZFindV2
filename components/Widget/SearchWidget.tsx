import {
  Box,
  Grid,
  HStack,
  Image,
  VStack,
  Text,
  AspectRatio,
  Stack,
  Show,
} from "@chakra-ui/react";
import BaseWidget from "./BaseWidget";
import { ItemStorageRelationProps } from "./ItemStorageRelationWidget";
import { GroupProps } from "./GroupWidget";
import Router from "next/router";
import { genGradient } from "services/gradientGenerator";
import { count } from "console";
import EditableCounter from "components/Minis/EditableCounter";

type SearchWidgetProps = {
  name: string;
  description: string;
  image: string;
  count: number;
  url: string;
};

export default function SearchWidget(props: SearchWidgetProps) {
  return (
    <Box
      // templateColumns={["repeat(6, 1fr)", "repeat(6, 1fr)", "repeat(12, 1fr)"]}
      overflow="hidden"
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => Router.push(props.url)}
    >
      <HStack w="100%">
        <AspectRatio
          width="50px"
          ratio={1}
          bgGradient={genGradient(props.name)}
        >
          <Image
            src={`/api/${props.image}`}
            hidden={props.image.length < 5}
          ></Image>
        </AspectRatio>
        <Stack direction="row" w="100%">
          <Stack
            direction="row"
            w="100%"
            align={"center"} // vertically align name, description
          >
            <Text
              w={["100%", "40%"]}
              noOfLines={1} //do not render more than one line
              wordBreak={"break-all"} //ellipsis in the middle of word, not only on new word
            >
              {props.name}
            </Text>
            <Show above="sm">
              <Text w="60%" noOfLines={1} wordBreak={"break-all"}>
                {props.description ? props.description : "No description."}
              </Text>
            </Show>
          </Stack>
          <EditableCounter count={props.count} isDisabled={true} />
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
