import {
  AspectRatio,
  Box,
  HStack,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import EditableCounter from "components/Composable/EditableCounter";
import Router from "next/router";
import { ChangeEventHandler } from "react";
import { genGradient } from "services/gradientGenerator";
import WidgetTitles from "./WidgetTitles";

type SearchWidgetProps = {
  //data
  name: string;
  description: string;
  image: string;
  count: number;
  url: string;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  handleAdd?: Function;
  handleRemove?: Function;
  handleNewCount?: ChangeEventHandler<HTMLInputElement>;

  forceMini?: boolean;
};

export default function SearchWidget(props: SearchWidgetProps) {
  //--column
  const column =
    useBreakpointValue(
      {
        base: true,
        sm: false,
      },
      { fallback: "md", ssr: typeof window === "undefined" }
    ) || props.forceMini == true;
  //--ret
  return (
    <Box
      overflow={"hidden"}
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => Router.push(props.url)}
      pr="2"
      _hover={{ bg: "gray.100" }}
      transition={"background-color 0.3s"}
      minH="60px"
    >
      <HStack>
        <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(props.name)}>
          {props.image.length > 5 ? (
            <Image src={`/api/${props.image}`} />
          ) : (
            <></>
          )}
        </AspectRatio>
        <WidgetTitles
          title={props.name}
          subtitle={props.description ? props.description : "No description."}
          column={column}
        />
        {!props.inverted && (
          <EditableCounter
            count={props.count}
            isDisabled={!props.isEdit}
            onChange={props.handleNewCount}
          />
        )}
        <AddRemoveButton
          mode={props.inverted ? 1 : -1}
          invisible={!props.isEdit}
          handleAdd={props.handleAdd!}
          handleRemove={props.handleRemove!}
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
