import { useToast } from "@chakra-ui/react";
import { ItemProps } from "./ItemWidget";
import { RelationProps } from "./RelationWidget";
import { StorageProps } from "./StorageWidget";
import { errorToast, successToast } from "services/toasty";
import Router from "next/router";
import BaseWidget2 from "./BaseWidget2";

type RelationWidget2Props = {
  relation: RelationProps;
  isItem: boolean;
  invert: boolean;
  showAction: boolean;
  editing: boolean;
};

export default function RelationWidget2({
  relation,
  isItem,
  invert,
  showAction,
  editing,
}: RelationWidget2Props) {
  const toaster = useToast();
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
  return (
    <BaseWidget2
      href={
        isItem ? "/item/" + relation.itemId : "/storage/" + relation.storageId
      }
      title={isItem ? relation.item.name : relation.storage.name}
      bg={"blue.300"}
      count={relation.count}
      handleRemove={handleRemove}
      safeRemove={false}
      handleAdd={handleAdd}
      invert={invert}
      showAction={showAction}
      editing={editing}
    />
  );
}
