import { StorageProps } from "./StorageWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { ItemProps } from "./ItemWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { errorToast, successToast } from "services/toasty";
import { RelationProps } from "./RelationWidget";

type ItemWidget2Props = {
  relation: RelationProps;
  invert: boolean;
  isAdmin: boolean;
};

export default function ItemWidget2({
  relation,
  invert,
  isAdmin,
}: ItemWidget2Props) {
  const toaster = useToast();
  const handleRemove = async () => {
    try {
      const body = {
        id: relation.storage.id,
        name: relation.storage.name,

        itemIds: relation.storage.relations
          .filter(
            (storageRelation) => storageRelation.itemId != relation.item.id
          )
          .map((item) => ({ id: item.id })),
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + item.id);
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
      const itemIds = targetstorage.items.map((item) => ({
        id: item.id,
      }));
      itemIds.push({ id: item.id });
      const body = {
        id: targetstorage.id,
        name: targetstorage.name,
        itemIds,
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        errorToast(toaster, "Unknown error on id: " + item.id);
      } else {
        successToast(toaster, "Success!");
        Router.reload();
      }
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  return (
    <BaseWidget2
      href={"/item/" + item.id}
      title={item.name}
      bg={"blue.300"}
      handleRemove={handleRemove}
      safeRemove={false}
      handleAdd={handleAdd}
      invert={invert}
      isAdmin={isAdmin}
    />
  );
}
