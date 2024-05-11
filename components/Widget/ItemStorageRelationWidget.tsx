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
import { ItemProps } from "types/db";
import { StorageProps } from "types/db";
import Router from "next/router";
import EditableCounter from "components/Minis/EditableCounter";
import Round from "components/Minis/Round";
import WidgetTitle from "components/Minis/WidgetTitle";
import AddRemoveButton from "components/Minis/AddRemoveButton";
import { MouseEventHandler } from "react";

export type ItemStorageRelationProps = {
  item: ItemProps;
  itemId: number;
  storage: StorageProps;
  storageId: number;
  count: number;
  inverted?: boolean;
};

type RelationWidgetProps = {
  relation: ItemStorageRelationProps;
  isItem: boolean;
  isInvert: boolean;
  isEdit: boolean;
  handleRemove?: MouseEventHandler<HTMLButtonElement>;
  handleAdd?: MouseEventHandler<HTMLButtonElement>;
  handleUpdate: Function;
};

export default function RelationWidget({
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
    <Flex w="100%" overflow="hidden" rounded="md" flexDir="row" h="8">
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

      <AddRemoveButton
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        mode={isEdit ? (isInvert ? 1 : -1) : 0}
      />
    </Flex>
  );
}
