import {
  Badge,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  useToast,
  Text,
  Input,
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
import { AdminProps } from "components/Widget/AdminWidget2";
import { useReducer, useState } from "react";
import { errorToast } from "services/toasty";
import RelationWidget2 from "components/Widget/RelationWidget2";
import { RelationProps } from "components/Widget/RelationWidget";

type PageProps = {
  item: ItemProps;
  storages: StorageProps[];
  admins: AdminProps[];
};

export default function ItemPage({ item, storages, admins }: PageProps) {
  //admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  //toaster
  const toaster = useToast();
  // state: 0=normal, 1=isEdit
  const [isEdit, setIsEdit] = useState(false);
  //newItem state
  const [newName, setNewName] = useState(item.name);
  const [newDescription, setNewDescription] = useState(item.description);
  const [newRelations, setNewRelations] = useState(item.relations);
  //track widgets
  const inRelations = isEdit ? newRelations : item.relations;
  const inIds = inRelations.map((relation) => relation.storageId);
  const outRelations: RelationProps[] = storages
    .filter((storage) => !inIds.includes(storage.id))
    .map((storage) => {
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
      const body = { id: item.id };
      const res = await fetch("/api/delete-item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push({ pathname: "/manage-items" });
    } catch (error) {
      errorToast(toaster, "" + error);
    }
  };
  //widgets
  // ret
  //console.log("itemId", "rerender", "newRelations", newRelations);
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          {isEdit ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fontSize="4xl"
            ></Input>
          ) : (
            <Text fontSize="4xl">{item.name}</Text>
          )}

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
                        id: item.id,
                        newName,
                        newDescription,
                        newRelations,
                      };
                      const res = await fetch("/api/update-item-full", {
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
                    setNewName(item.name);
                    setNewDescription(item.description);
                    setNewRelations(item.relations);
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
                name={" the item: " + item.name}
                handleDelete={handleDelete}
              />
            </Center>
          )}
        </Flex>
      </Center>
      {isEdit ? (
        <Input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        ></Input>
      ) : (
        <Text>{item.description}</Text>
      )}
      <Box h="5"></Box>
      {status != "loading" && (
        <SearchView
          setIn={inRelations.map((relation) => {
            return {
              name: relation.storage.name,
              widget: (
                <RelationWidget2
                  relation={relation}
                  isItem={false}
                  isInvert={false}
                  isEdit={isEdit}
                  handleRemove={() => {
                    setNewRelations(
                      newRelations.filter(
                        (t) => t.storageId != relation.storageId
                      )
                    );
                  }}
                  handleAdd={() => {
                    const copy = [...newRelations];
                    copy.push(relation);
                    setNewRelations(copy);
                  }}
                  handleUpdate={(e: number) => {
                    const copy = newRelations.map((a) => ({ ...a }));
                    const tar = copy.find(
                      (t) => t.storageId == relation.storageId
                    );
                    if (tar != null) {
                      tar.count = e;
                      setNewRelations(copy);
                    }
                  }}
                />
              ),
            };
          })}
          setOut={outRelations.map((relation) => {
            return {
              name: relation.storage.name,
              widget: (
                <RelationWidget2
                  relation={relation}
                  isItem={false}
                  isInvert={true}
                  isEdit={isEdit}
                  handleRemove={() =>
                    setNewRelations(
                      newRelations.filter(
                        (t) => t.storageId != relation.storageId
                      )
                    )
                  }
                  handleAdd={() => {
                    const copy = [...newRelations];
                    copy.push(relation);
                    setNewRelations(copy);
                  }}
                  handleUpdate={(e: number) => {
                    const copy = [...newRelations];
                    const tar = copy.find(
                      (t) => t.storageId == relation.storageId
                    );
                    if (tar != null) {
                      tar.count = e;
                      setNewRelations(copy);
                    }
                  }}
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
  const item = await prisma.item.findUnique({
    where: {
      id: Number(context.params?.itemId),
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
  const storages = await prisma.storage.findMany({});
  const admins = await prisma.admin.findMany();
  return {
    props: {
      item: item,
      storages: storages,
      admins: admins,
    },
  };
};
