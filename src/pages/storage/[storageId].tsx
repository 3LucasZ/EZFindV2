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
import ConfirmActionModal from "components/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useState } from "react";
import RelationWidget from "components/Widget/RelationWidget";
import { RelationProps } from "components/Widget/RelationWidget";
import React from "react";
import AutoResizeTextarea from "components/AutoResizeTextarea";
import { poster } from "services/poster";
import { IoImageOutline } from "react-icons/io5";
import ImageModal from "components/ImageModal";

type PageProps = {
  storage: StorageProps;
  items: ItemProps[];
};

export default function StoragePage({ storage, items }: PageProps) {
  const { data: session, status } = useSession();
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
  const {
    isOpen: isOpenTrash,
    onOpen: onOpenTrash,
    onClose: onCloseTrash,
  } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: storage.id };
    const res = await poster("/api/delete-storage", body, toaster);
    if (res.status == 200) await Router.push({ pathname: "/manage-storages" });
  };
  // handle view modal
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();
  //handle upload image
  const uploadImage = async (imageStr: string) => {
    const body = { id: storage.id, newImageStr: imageStr };
    const res = await poster("/api/update-storage-image", body, toaster);
    if (res.status == 200) Router.reload();
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
    <Layout isAdmin={session?.user.isAdmin}>
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
          <IconButton
            ml="2"
            colorScheme="blue"
            aria-label=""
            icon={<Icon as={IoImageOutline} boxSize={5} />}
            onClick={() => {
              onOpenViewer();
            }}
          />
          <ImageModal
            onClose={onCloseViewer}
            isOpen={isOpenViewer}
            onUpload={uploadImage}
            imageStr={storage.image}
          />
          {session?.user.isAdmin && (
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
          {session?.user.isAdmin && (
            <IconButton
              colorScheme="red"
              aria-label=""
              icon={isEdit ? <CloseIcon /> : <DeleteIcon />}
              onClick={() => {
                if (isEdit) {
                  setIsEdit(false);
                } else {
                  onOpenTrash();
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
          <ConfirmActionModal
            isOpen={isOpenTrash}
            onClose={onCloseTrash}
            actionStr={"delete the storage: " + storage.name}
            protectedAction={handleDelete}
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
                <RelationWidget
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
                <RelationWidget
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
          isAdmin={session?.user.isAdmin}
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
          item: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const items = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
    },
  });

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
    },
  };
};
