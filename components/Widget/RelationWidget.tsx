import { Box, Flex, IconButton, Input, Link, useToast } from "@chakra-ui/react";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { ItemProps } from "./ItemWidget";
import { StorageProps } from "./StorageWidget";

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
    <Flex h={8}>
      <Link
        bg={isItem ? "teal.300" : "blue.300"}
        _hover={isEdit ? {} : { bg: isItem ? "teal.400" : "blue.400" }}
        color="white"
        href={
          isItem ? "/item/" + relation.itemId : "/storage/" + relation.storageId
        }
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
          pointerEvents: isEdit && "none",
        }}
        w="100%"
        h={8}
        px={5}
        roundedLeft="md"
      >
        {isItem ? relation.item.name : relation.storage.name}
      </Link>
      {!isInvert && (
        <Box
          bg="orange.200"
          width={"60px"}
          roundedRight={isEdit ? "none" : "md"}
        >
          <Input
            value={relation.count}
            onChange={(e) => handleUpdate(parseInt(e.target.value))}
            isDisabled={!isEdit}
            type="number"
            color="white"
            p="0"
            h={8}
            textAlign={"center"}
            _disabled={{ color: "white", border: "none" }}
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
          w={8}
          roundedLeft="none"
          roundedRight="md"
        />
      )}
    </Flex>
  );
}
