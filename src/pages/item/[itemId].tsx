import {
  Badge,
  Box,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  IconButton,
  Input,
  useDisclosure,
  useToast,
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
import React, { ReactElement, ReactNode, useState } from "react";
import { errorToast } from "services/toasty";
import RelationWidget2 from "components/Widget/RelationWidget2";
import { RelationProps } from "components/Widget/RelationWidget";

type PageProps = {
  item: ItemProps;
  storages: StorageProps[];
  admins: AdminProps[];
};

export default function ItemPage({ item, storages, admins }: PageProps) {
  // admin
  const { data: session, status } = useSession();
  const isAdmin = checkAdmin(session, admins);
  // toaster
  const toaster = useToast();
  // editing
  const [editing, setEditing] = useState(false);
  //setIn and setOut
  const inIds = item.relations.map((relation) => relation.storageId);
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
  function genSetIn(editing: boolean) {
    return item.relations.map((relation) => {
      return {
        name: relation.storage.name,
        widget: (
          <RelationWidget2
            relation={relation}
            isItem={false}
            invert={false}
            showAction={isAdmin && !editing}
            editing={editing}
          />
        ),
      };
    });
  }
  const [setIn, setSetIn] = useState<{ name: string; widget: ReactNode }[]>(
    genSetIn(editing)
  );
  function genSetOut(editing: boolean) {
    console.log(editing);
    return outRelations.map((relation) => {
      return {
        name: relation.storage.name,
        widget: (
          <RelationWidget2
            relation={relation}
            isItem={false}
            invert={true}
            showAction={isAdmin && !editing}
            editing={false}
          />
        ),
      };
    });
  }
  const [setOut, setSetOut] = useState<{ name: string; widget: JSX.Element }[]>(
    genSetOut(editing)
  );
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
  const handleSubmit = async () => {};
  // ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Editable
            defaultValue={item.name}
            fontSize="4xl"
            as="b"
            isPreviewFocusable={editing}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>

          {isAdmin && (
            <Center>
              <IconButton
                ml={2}
                mr={2}
                colorScheme="teal"
                aria-label="_"
                icon={editing ? <CheckIcon /> : <EditIcon />}
                onClick={() => {
                  if (editing) {
                    setEditing(false);
                    setSetIn(genSetIn(false));
                    setSetOut(genSetOut(false));
                  } else {
                    setEditing(true);
                    setSetIn(genSetIn(true));
                    setSetOut(genSetOut(true));
                  }
                }}
              />
              <IconButton
                colorScheme="red"
                aria-label="_"
                icon={editing ? <CloseIcon /> : <DeleteIcon />}
                onClick={onOpen}
              />
              <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                name={" the item: " + item.name}
                handleDelete={
                  editing ? async () => Router.reload() : handleDelete
                }
              />
            </Center>
          )}
        </Flex>
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={setIn}
          setOut={setOut}
          isAdmin={isAdmin}
          editing={editing}
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
