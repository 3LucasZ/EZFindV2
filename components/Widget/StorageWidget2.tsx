import { StorageProps } from "./StorageWidget";
import BaseWidget2 from "./BaseWidget2";
import Router from "next/router";
import { ItemProps } from "./ItemWidget";
import { debugMode } from "services/constants";
import { useToast } from "@chakra-ui/react";
import { errorToast, successToast } from "services/toasty";

type StorageWidget2Props = {
  storage: StorageProps;
  targetItem: ItemProps;
  invert: boolean;
  isAdmin: boolean;
};

export default function StorageWidget2({
  storage,
  targetItem,
  invert,
  isAdmin,
}: StorageWidget2Props) {
  const toaster = useToast();
  const handleRemove = async () => {
    try {
      const body = {
        id: targetItem.id,
        name: targetItem.name,
        storageIds: targetItem.storages
          .filter((item) => item.id != storage.id)
          .map((item) => ({ id: item.id })),
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + storage.id);
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
      const storageIds = targetItem.storages.map((item) => ({
        id: item.id,
      }));
      storageIds.push({ id: storage.id });
      const body = {
        id: targetItem.id,
        name: targetItem.name,
        PIN: targetItem.PIN,
        storageIds,
      };
      if (debugMode) console.log(body);
      const res = await fetch("/api/upsert-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status != 200) {
        errorToast(toaster, "Unknown error on id: " + storage.id);
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
      href={"/storage/" + storage.id}
      title={storage.name}
      bg={"blue.300"}
      handleRemove={handleRemove}
      safeRemove={false}
      handleAdd={handleAdd}
      invert={invert}
      isAdmin={isAdmin}
    />
  );
}
