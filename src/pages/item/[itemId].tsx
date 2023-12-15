import {
  Badge,
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
import StorageWidget2 from "components/Widget/StorageWidget2";
import { debugMode } from "services/constants";

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
  //inId and outId
  const inId = item.storages.map((item) => item.id);
  const outId = storages
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  // delete modal
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
      if (debugMode) console.error(error);
    }
  };
  // ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Heading>{item.name}</Heading>
          {isAdmin && (
            <>
              <IconButton
                ml={2}
                mr={2}
                colorScheme="teal"
                aria-label="edit"
                icon={<EditIcon />}
                onClick={() =>
                  Router.push({
                    pathname: "/upsert-item",
                    query: { id: item.id },
                  })
                }
              />
              <IconButton
                onClick={onOpen}
                colorScheme="red"
                aria-label="delete"
                icon={<DeleteIcon />}
              />
              <ConfirmDeleteModal
                isOpen={isOpen}
                onClose={onClose}
                name={" the item: " + item.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {
          <Badge colorScheme={item.using ? "green" : "red"}>
            {item.using ? item.using.name : "Offline"}
          </Badge>
        }
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var storage = storages.find((x) => x.id == id);
            if (!storage) storage = storages[0];
            return {
              name: storage.name,
              widget: (
                <StorageWidget2
                  storage={storage}
                  key={storage.id}
                  targetItem={item}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var storage = storages.find((x) => x.id == id);
            if (!storage) storage = storages[0];
            return {
              name: storage.name,
              widget: (
                <StorageWidget2
                  storage={storage}
                  key={storage.id}
                  targetItem={item}
                  invert={true}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          isAdmin={isAdmin}
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
      storages: true,
      using: true,
    },
  });
  const storages = await prisma.storage.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      item: item,
      storages: storages,
      admins: admins,
    },
  };
};
