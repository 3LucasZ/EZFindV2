import {
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  Icon,
} from "@chakra-ui/icons";
import { SlPrinter } from "react-icons/sl";
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
import RelationWidget2 from "components/Widget/RelationWidget";
import { RelationProps } from "components/Widget/RelationWidget";
import React from "react";
import AutoResizeTextarea from "components/AutoResizeTextarea";
import { poster } from "services/poster";

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
    const body = { id: storage.id };
    const res = await poster("/api/delete-storage", body, toaster);
    if (res.status == 200) await Router.push({ pathname: "/manage-storages" });
  };
  //handle update storage
  const handleUpdateStorage = async () => {
    const body = {
      id: storage.id,
      newName,
      newDescription,
      newRelations,
    };
    const res = await poster("/api/update-storage-full", body, toaster);
    if (res.status == 200) Router.reload();
  };

  return (
    <Layout isAdmin={isAdmin}>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <AutoResizeTextarea
          value={isEdit ? newName : storage.name}
          onChange={(e) => setNewName(e.target.value)}
          isDisabled={!isEdit}
          maxLength={50}
          fontSize={["xl", "xl", "2xl", "3xl", "4xl"]}
          display={"block"}
          _disabled={{ color: "black", borderColor: "white" }}
          textAlign={"center"}
          sx={{ opacity: "1" }}
        />

        <Center>
          {isAdmin && (
            <IconButton
              ml={2}
              mr={2}
              colorScheme="teal"
              aria-label=""
              icon={isEdit ? <CheckIcon /> : <EditIcon />}
              onClick={async () => {
                if (isEdit) {
                  handleUpdateStorage();
                } else {
                  setNewName(storage.name);
                  setNewDescription(storage.description);
                  setNewRelations(storage.relations);
                  setIsEdit(true);
                }
              }}
            />
          )}
          {isAdmin && (
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
          )}
          <IconButton
            ml={2}
            mr={2}
            colorScheme="blue"
            aria-label="edit"
            icon={<Icon as={SlPrinter} />}
            onClick={() =>
              Router.push({
                pathname: "/print/" + storage.id,
              })
            }
          />
          <ConfirmDeleteModal
            isOpen={isOpen}
            onClose={onClose}
            name={" the storage: " + storage.name}
            handleDelete={handleDelete}
          />
        </Center>
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
          onChange={(e) => setNewDescription(e.target.value)}
          isDisabled={!isEdit}
          maxLength={250}
          _disabled={{ color: "black", borderColor: "white" }}
          fontSize={["xs", "xs", "sm", "md", "lg", "xl"]}
          sx={{ opacity: "1" }}
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
  if (storage == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      storage,
      items,
      admins,
    },
  };
};
