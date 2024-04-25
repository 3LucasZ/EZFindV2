import {
  Box,
  Flex,
  IconButton,
  Input,
  Link,
  useToast,
  Text,
  Grid,
} from "@chakra-ui/react";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { ItemProps } from "./ItemWidget";
import { StorageProps } from "./StorageWidget";
import Router from "next/router";
import EditableCounter from "components/Minis/EditableCounter";
import Round from "components/Minis/Round";
import WidgetTitle from "components/Minis/WidgetTitle";

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
  const toaster = useToast();
  return (
    //rounded widget
    <Flex w="100%" overflow="hidden" rounded="md" flexDir="row">
      <WidgetTitle
        bg={isItem ? "cyan.400" : "blue.400"}
        _hover={{ bg: isItem ? "cyan.500" : "blue.500" }}
        onClick={() =>
          Router.push(
            isItem
              ? "/item/" + relation.itemId
              : "/storage/" + relation.storageId
          )
        }
        title={isItem ? relation.item.name : relation.storage.name}
      />
      {!isInvert && (
        <EditableCounter
          count={relation.count}
          onChange={(e) => {
            const num = parseInt(e.target.value);
            handleUpdate(Number.isNaN(num) ? 0 : parseInt(e.target.value));
          }}
          isDisabled={!isEdit}
        />
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
    </Flex>
  );
}
