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
import { GetServerSideProps } from "next";
import Router from "next/router";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { ItemProps } from "components/Widget/ItemWidget";
import { StorageProps } from "components/Widget/StorageWidget";
import { checkAdmin } from "services/checkAdmin";
import { AdminProps } from "components/Widget/AdminWidget2";
import ItemWidget2 from "components/Widget/ItemWidget2";
import { debugMode } from "services/constants";
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
  //inId outId
  const inId = storage.relations.map((relation) => relation.itemId);
  const outId = items.map((item) => item.id).filter((id) => !inId.includes(id));
  //modal
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
      if (debugMode) console.error(error);
    }
  };
  //ret
  return (
    <Layout isAdmin={isAdmin}>
      <Center pb={3} flexDir={"column"}>
        <Flex>
          <Heading>{storage.name}</Heading>
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
                    pathname: "/upsert-storage",
                    query: { id: storage.id },
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
                name={" the storage: " + storage.name}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Flex>
        {<Badge colorScheme={"green"}>"Standby"</Badge>}
      </Center>
      {status != "loading" && (
        <SearchView
          setIn={inId.map((id) => {
            var item = items.find((x) => x.id == id);
            if (!item) item = items[0];
            return {
              name: item.name,
              widget: (
                <ItemWidget2
                  item={item}
                  key={item.id}
                  targetstorage={storage}
                  invert={false}
                  isAdmin={isAdmin}
                />
              ),
            };
          })}
          setOut={outId.map((id) => {
            var item = items.find((x) => x.id == id);
            if (!item) item = items[0];
            return {
              name: item.name,
              widget: (
                <ItemWidget2
                  item={item}
                  key={item.id}
                  targetstorage={storage}
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
  const storage = await prisma.storage.findUnique({
    where: {
      id: Number(context.params?.storageId),
    },
    include: {
      relations: true,
    },
  });
  const items = await prisma.item.findMany();
  const admins = await prisma.admin.findMany();
  return {
    props: {
      storage: storage,
      items: items,
      admins: admins,
    },
  };
};
