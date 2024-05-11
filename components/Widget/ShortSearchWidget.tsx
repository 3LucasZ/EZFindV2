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

import { ItemStorageRelationProps } from "types/db";
import { GroupProps } from "./GroupWidget";
import Router from "next/router";
import { genGradient } from "services/gradientGenerator";
import { count } from "console";
import EditableCounter from "components/Minis/EditableCounter";
import AddRemoveButton from "components/Minis/AddRemoveButton";

type SearchWidgetProps = {
  //data
  name: string;
  description: string;
  image: string;
  count: number;
  url: string;

  //behavior
  mode?: number; //-1 (remove), 0 (neutral), 1 (add)

  //functions
  onInvert?: Function;
  handleAdd?: Function;
  handleRemove?: Function;
  handleUpdate?: Function;
};

export default function SearchWidget(props: SearchWidgetProps) {
  return (
    <Box
      overflow={"hidden"}
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => Router.push(props.url)}
      pr="2"
      _hover={{ bg: "gray.100" }}
      minH="60px"
    >
      <HStack>
        <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(props.name)}>
          <Image
            src={`/api/${props.image}`}
            hidden={props.image.length < 5}
          ></Image>
        </AspectRatio>
        <HStack w="100%">
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
        </HStack>
        <EditableCounter count={props.count} isDisabled={true} />
        <AddRemoveButton
          mode={props.mode ? props.mode : 1}
          invisible={props.mode == 0 ? true : false}
          handleAdd={() => props.handleAdd && props.handleAdd()}
          handleRemove={() => props.handleRemove && props.handleRemove()}
        />
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
