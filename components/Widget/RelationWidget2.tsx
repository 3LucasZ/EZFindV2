import { Box, Flex, IconButton, Input, Link, useToast } from "@chakra-ui/react";
import { ItemProps } from "./ItemWidget";
import { RelationProps } from "./RelationWidget";
import { StorageProps } from "./StorageWidget";
import { errorToast, successToast } from "services/toasty";
import Router from "next/router";
import BaseWidget2 from "./BaseWidget2";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

type RelationWidget2Props = {
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
}: RelationWidget2Props) {
  //toaster
  const toaster = useToast();
  //ret
  return (
    <Flex h={8}>
      <Link
        bg={isItem ? "teal.300" : "blue.300"}
        _hover={{ bg: isItem ? "teal.400" : "blue.400" }}
        color="white"
        href={
          isItem ? "/item/" + relation.itemId : "/storage/" + relation.storageId
        }
        style={{ textDecoration: "none" }}
        sx={{
          WebkitUserDrag: "none",
        }}
        w="100%"
        h="100%"
        px={5}
      >
        {isItem ? relation.item.name : relation.storage.name}
      </Link>
      {!isInvert && (
        <Box bg="orange.200" px={5} color="white">
          {isEdit ? (
            <Input
              value={relation.count}
              type="number"
              onChange={(e) => handleUpdate(e.target.value)}
            />
          ) : (
            relation.count
          )}
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
          rounded="none"
        />
      )}
    </Flex>
  );
}
