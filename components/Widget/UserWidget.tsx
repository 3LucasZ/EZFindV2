import {
  Box,
  HStack,
  Image,
  Text,
  AspectRatio,
  Stack,
  Select,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { UserCardModal } from "components/Main/UserCardModal";
import WidgetTitles from "./WidgetTitles";

type UserWidgetProps = {
  //data
  name: string;
  email: string;
  image: string;
  perm?: number;
  isAdmin: boolean;

  //state
  inverted?: boolean;
  isEdit?: boolean;

  //functions
  askConfirmation?: boolean;
  handleAdd?: Function;
  handleRemove?: Function;
  handleNewPerm?: Function;

  forceMini?: boolean;
};

export default function UserWidget(props: UserWidgetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(
  //   "perm, inverted, isEdit",
  //   props.perm,
  //   props.inverted,
  //   props.isEdit
  // );
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
    <>
      <Box
        overflow={"hidden"}
        rounded="md"
        boxShadow={"md"}
        mx={1} //so we can see the side shadows
        onClick={() => {
          if (!props.isEdit) onOpen();
        }}
        px="2"
        bg={
          // props.perm == 2
          //   ? "purple.100"
          //   : props.perm == 1
          //   ? "blue.100"
          //   :
          "white"
        }
        _hover={
          props.isEdit
            ? {}
            : {
                bg:
                  // props.perm == 2
                  //   ? "purple.200"
                  //   : props.perm == 1
                  //   ? "blue.200"
                  //   :
                  "gray.100",
              }
        }
        // borderWidth={"3px"}
        // borderColor="purple.100"
        minH="60px"
        transition={"background-color 0.3s"}
      >
        <HStack h="100%">
          <AspectRatio
            minW="45px"
            maxW="45px"
            ratio={1}
            // bgGradient={genGradient(props.name)}
          >
            <Image
              src={props.image} //pfp stored on google servers, will NOT use our API
              // fallbackSrc="https://via.placeholder.com/150"
              hidden={props.image?.length < 5}
              borderRadius="full"
            ></Image>
          </AspectRatio>
          <Box w="2"></Box>
          <WidgetTitles
            title={props.name}
            subtitle={props.email}
            column={column}
          />
          <Select
            //--looks--
            color={
              props.perm == 2
                ? "purple.400"
                : props.perm == 1
                ? "blue.400"
                : "black"
            }
            rounded={"lg"}
            size={"sm"}
            borderColor={"gray.200"}
            borderWidth={props.isEdit ? "1px" : "0px"}
            pointerEvents={props.isEdit ? "auto" : "none"}
            iconSize={props.isEdit ? "md" : "0"}
            minW="80px"
            maxW="20%"
            h="10"
            //---behavior---
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              props.handleNewPerm!(
                Number.isNaN(num) ? 0 : parseInt(e.target.value)
              );
            }}
            value={props.perm}
            display={props.inverted || props.perm == undefined ? "none" : ""}
          >
            <option value="0">Viewer</option>
            <option value="1">Editor</option>
            <option value="2">Manager</option>
          </Select>

          <AddRemoveButton
            mode={props.inverted ? 1 : -1}
            invisible={!props.isEdit}
            handleAdd={props.handleAdd!}
            handleRemove={props.handleRemove!}
            askConfirmation={props.askConfirmation}
            actionStr={
              (!props.inverted
                ? "revoke admin priveleges from "
                : "grant admin priveleges to ") +
              `${props.name} (${props.email})`
            }
          />
        </HStack>
      </Box>
      <UserCardModal
        name={props.name}
        email={props.email}
        image={props.image}
        isAdmin={props.isAdmin}
        groups={0}
        isOpen={isOpen}
        onClose={onClose}
      ></UserCardModal>
    </>
  );
}
