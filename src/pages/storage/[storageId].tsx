import {
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ItemProps } from "components/Widget/ItemWidget";
import { GetServerSideProps } from "next";
import { StorageProps } from "components/Widget/StorageWidget";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget";
import { useState } from "react";
import { errorToast } from "services/toasty";
import RelationWidget2 from "components/Widget/RelationWidget";
import { RelationProps } from "components/Widget/RelationWidget";
import React from "react";
import { AutoResizeTextarea } from "components/AutoResizeTextarea";

type PageProps = {
  storage: StorageProps;
  items: ItemProps[];
  admins: AdminProps[];
};

export default function StoragePage({ storage, items, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //toaster
  const toaster = useToast();
  // state: 0=normal, 1=isEdit
  const [isEdit, setIsEdit] = useState(false);
  //newItem state
  const [newName, setNewName] = useState(storage.name);
  const [newDescription, setNewDescription] = useState(storage.description);
  const [newRelations, setNewRelations] = useState(storage.relations);
  //track widgets
  const inRelations = isEdit ? newRelations : storage.relations;
  const inIds = inRelations.map((relation) => relation.itemId);
  const outRelations: RelationProps[] = items
    .filter((item) => !inIds.includes(item.id))
    .map((item) => {
      return {
        item: item,
        itemId: item.id,
        storage: storage,
        storageId: storage.id,
        count: 0,
      };
    });
  // handle delete modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      const body = { id: storage.id };
      const res = await fetch("/api/delete-storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/manage-storages" });
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };

  return (
    <Layout>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <AutoResizeTextarea
          value={isEdit ? newName : storage.name}
          onChange={(e) =>
            e.target.value.length <= 250 && setNewName(e.target.value)
          }
          fontSize="4xl"
          display={"block"}
          isDisabled={!isEdit}
          _disabled={{ color: "black", borderColor: "white" }}
          textAlign={"center"}
        />

        {isAdmin && (
          <Center>
            <IconButton
              ml={2}
              mr={2}
              colorScheme="teal"
              aria-label=""
              icon={isEdit ? <CheckIcon /> : <EditIcon />}
              onClick={async () => {
                if (isEdit) {
                  setIsEdit(false);
                  try {
                    const body = {
                      id: storage.id,
                      newName,
                      newDescription,
                      newRelations,
                    };
                    const res = await fetch("/api/update-storage-full", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(body),
                    });
                    Router.reload();
                    errorToast(toaster, await res.json());
                  } catch (error) {
                    errorToast(toaster, "" + error);
                  }
                } else {
                  setNewName(storage.name);
                  setNewDescription(storage.description);
                  setNewRelations(storage.relations);
                  setIsEdit(true);
                }
              }}
            />
            <IconButton
              colorScheme="red"
              aria-label=""
              icon={isEdit ? <CloseIcon /> : <DeleteIcon />}
              onClick={() => {
                if (isEdit) {
                  setIsEdit(false);
                } else {
                  onOpen();
                }
              }}
            />
            <ConfirmDeleteModal
              isOpen={isOpen}
              onClose={onClose}
              name={" the item: " + storage.name}
              handleDelete={handleDelete}
            />
          </Center>
        )}
      </Flex>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <AutoResizeTextarea
          value={
            isEdit
              ? newDescription
              : storage.description
              ? storage.description
              : "No description."
          }
          onChange={(e) => {
            console.log(e);
            if (e.target.value.length <= 250) {
              setNewDescription(e.target.value);
            }
          }}
          isDisabled={!isEdit}
          _disabled={{ color: "black", borderColor: "white" }}
        />
      </Flex>

      {status != "loading" && (
        <SearchView
          setIn={inRelations.map((relation) => {
            return {
              name: relation.storage.name,
              widget: (
                <RelationWidget2
                  relation={relation}
                  isItem={true}
                  isInvert={false}
                  isEdit={isEdit}
                  handleRemove={() => {
                    setNewRelations(
                      newRelations.filter((t) => t.itemId != relation.itemId)
                    );
                  }}
                  handleAdd={() => {
                    const copy = [...newRelations];
                    copy.push(relation);
                    setNewRelations(copy);
                  }}
                  handleUpdate={(e: number) => {
                    const copy = newRelations.map((a) => ({ ...a }));
                    const tar = copy.find((t) => t.itemId == relation.itemId);
                    if (tar != null) {
                      tar.count = e;
                      setNewRelations(copy);
                    }
                  }}
                  key={relation.itemId}
                />
              ),
            };
          })}
          setOut={outRelations.map((relation) => {
            return {
              name: relation.item.name,
              widget: (
                <RelationWidget2
                  relation={relation}
                  isItem={true}
                  isInvert={true}
                  isEdit={isEdit}
                  handleRemove={() =>
                    setNewRelations(
                      newRelations.filter((t) => t.itemId != relation.itemId)
                    )
                  }
                  handleAdd={() => {
                    const copy = [...newRelations];
                    copy.push(relation);
                    setNewRelations(copy);
                  }}
                  handleUpdate={(e: number) => {
                    const copy = [...newRelations];
                    const tar = copy.find((t) => t.itemId == relation.itemId);
                    if (tar != null) {
                      tar.count = e;
                      setNewRelations(copy);
                    }
                  }}
                  key={relation.itemId}
                />
              ),
            };
          })}
          isAdmin={isAdmin}
          isEdit={isEdit}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const storage = await prisma.storage.findUnique({
    where: {
      id: Number(context.params?.storageId),
    },
    include: {
      relations: {
        include: {
          item: true,
          storage: true,
        },
      },
    },
  });
  const items = await prisma.item.findMany({});
  const admins = await prisma.admin.findMany();
  return {
    props: {
      storage,
      items,
      admins,
    },
  };
};
