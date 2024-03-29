import {
  Box,
  Flex,
  IconButton,
  Input,
  Link,
  useToast,
  Text,
} from "@chakra-ui/react";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { ItemProps } from "./ItemWidget";
import { StorageProps } from "./StorageWidget";
import Router from "next/router";

export type RelationProps = {
  item: ItemProps;
  itemId: number;
  storage: StorageProps;
  storageId: number;
  count: number;
};

type RelationWidgetProps = {
  relation: RelationProps;
  isItem: boolean;
  isInvert: boolean;
  isEdit: boolean;
  handleRemove: Function;
  handleAdd: Function;
  handleUpdate: Function;
};

export default function RelationWidget2({
  relation,
  isItem,
  isInvert,
  isEdit,
  handleRemove,
  handleAdd,
  handleUpdate,
}: RelationWidgetProps) {
  //toaster
  const toaster = useToast();
  //ret
  return (
    <Box
      //size
      minH={8}
      maxW="100%"
      //color
      bg={isItem ? "cyan.400" : "blue.400"}
      _hover={isEdit ? {} : { bg: isItem ? "cyan.500" : "blue.500" }}
      color="white"
      //position
      flexDir="row"
      alignItems={"center"}
      //misc
      display="flex"
      overflow="hidden"
      rounded="md"
    >
      <Box
        //size
        w={
          "calc(100%" +
          (!isInvert ? " - 60px" : "") +
          (isEdit ? " - 40px" : "") +
          ")"
        }
        px={4}
        //misc
        onClick={() =>
          Router.push(
            isItem
              ? "/item/" + relation.itemId
              : "/storage/" + relation.storageId
          )
        }
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
          pointerEvents: isEdit && "none",
        }}
      >
        <Text noOfLines={1}>
          {isItem ? relation.item.name : relation.storage.name}
        </Text>
      </Box>
      {!isInvert && (
        <Box bg="orange.200" w="60px">
          <Input
            value={relation.count}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              handleUpdate(Number.isNaN(num) ? 0 : parseInt(e.target.value));
            }}
            isDisabled={!isEdit}
            type="tel"
            color="white"
            h={8}
            textAlign={"center"}
            _disabled={{ color: "white", border: "none" }}
            sx={{ opacity: "1" }}
            rounded="none"
            maxLength={5} //9999
          />
        </Box>
      )}
      {isEdit && (
        <IconButton
          onClick={() => (isInvert ? handleAdd() : handleRemove())}
          bg={isInvert ? "green.300" : "red.300"}
          _hover={{ bg: isInvert ? "green.400" : "red.400" }}
          color="white"
          aria-label={isInvert ? "add" : "delete"}
          icon={isInvert ? <SmallAddIcon /> : <SmallCloseIcon />}
          h={8}
          w={"40px"}
          rounded="none"
        />
      )}
    </Box>
  );
}
