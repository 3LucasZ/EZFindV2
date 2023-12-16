import { Box, Flex, IconButton, Link, useToast } from "@chakra-ui/react";
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
};

export default function RelationWidget2({
  relation,
  isItem,
  isInvert,
  isEdit,
}: RelationWidget2Props) {
  //toaster
  const toaster = useToast();
  //state
  const [nextCount, setNextCount] = useState(relation.count);
  //handlers
  const handleRemove = async () => {
    try {
      const body = {
        itemId: relation.itemId,
        storageId: relation.storageId,
      };
      const res = await fetch("/api/delete-relation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, await res.json());
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  const handleAdd = async () => {
    try {
      const body = {
        itemId: relation.itemId,
        storageId: relation.storageId,
        count: relation.count,
      };
      const res = await fetch("/api/create-relation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, await res.json());
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  const handleUpdate = async () => {
    try {
      const body = {
        itemId: relation.itemId,
        storageId: relation.storageId,
        count: nextCount,
      };
      const res = await fetch("/api/update-relation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, await res.json());
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
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
      <Box bg="orange.200" px={5} color="white">
        {relation.count}
      </Box>
      {isEdit && (
        <IconButton
          onClick={isInvert ? handleAdd : handleRemove}
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
