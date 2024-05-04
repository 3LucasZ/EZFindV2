import {
  ButtonGroup,
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
import ConfirmActionModal from "components/Main/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import SearchView from "components/Main/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useState } from "react";
import RelationWidget from "components/Widget/ItemStorageRelationWidget";
import { ItemStorageRelationProps } from "components/Widget/ItemStorageRelationWidget";
import React from "react";
import AutoResizeTextarea from "components/Minis/AutoResizeTextarea";
import { poster } from "services/poster";
import { IoImageOutline } from "react-icons/io5";
import ImageModal from "components/Main/ImageModal";
import EditableTitle from "components/Minis/EditableTitle";
import EditableSubtitle from "components/Minis/EditableSubtitle";

type PageProps = {
  storage: StorageProps;
  items: ItemProps[];
};

export default function StoragePage({ storage, items }: PageProps) {
  const { data: session, status, update } = useSession();
  //toaster
  const toaster = useToast();
  // state: 0=normal, 1=isEdit
  const [isEdit, setIsEdit] = useState(false);
  //newItem state
  const [newName, setNewName] = useState(storage.name);
  const [newDescription, setNewDescription] = useState(storage.description);
  const [newRelations, setNewRelations] = useState(storage.itemRelations);
  //track widgets
  const inRelations = isEdit ? newRelations : storage.itemRelations;
  const inIds = inRelations.map((relation) => relation.itemId);
  const outRelations: ItemStorageRelationProps[] = items
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
  const uploadImage = async (newImage: string) => {
    //delete old image
    var body, res;
    body = { image: storage.image };
    res = await poster("/api/delete-image", body, toaster, false, true);
    if (res.status == 200) {
      //upload new image
      body = { image: newImage };
      res = await poster("/api/upload-image", body, toaster, false, true);
      const imageUrl = await res.json();
      console.log("upload-image-client fileUrl:", imageUrl);
      if (res.status == 200) {
        //attach new image to item
        const body = { id: storage.id, image: imageUrl };
        const res = await poster("/api/update-storage-image", body, toaster);
        if (res.status == 200) {
          Router.reload();
        }
      }
    }
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
        <EditableTitle
          value={isEdit ? newName : storage.name}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewName(e.target.value)
          }
          isDisabled={!isEdit}
        />
        <Center>
          <ButtonGroup spacing="2" pl="2">
            <IconButton
              colorScheme="purple"
              aria-label=""
              icon={<Icon as={SlPrinter} />}
              onClick={() =>
                Router.push({
                  pathname: "/print/" + storage.id,
                })
              }
            />
            <IconButton
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
                colorScheme="teal"
                aria-label=""
                icon={isEdit ? <CheckIcon /> : <EditIcon />}
                onClick={async () => {
                  if (isEdit) {
                    handleUpdateStorage();
                  } else {
                    setNewName(storage.name);
                    setNewDescription(storage.description);
                    setNewRelations(storage.itemRelations);
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
            <ConfirmActionModal
              isOpen={isOpenTrash}
              onClose={onCloseTrash}
              actionStr={"delete the storage: " + storage.name}
              protectedAction={handleDelete}
            />
          </ButtonGroup>
        </Center>
      </Flex>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <EditableSubtitle
          value={
            isEdit
              ? newDescription
              : storage.description
              ? storage.description
              : "No description."
          }
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewDescription(e.target.value)
          }
          isDisabled={!isEdit}
          placeholder="Description"
        />
      </Flex>

      {status != "loading" && (
        <SearchView
          setIn={inRelations.map((relation) => {
            return {
              name: relation.item.name,
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
  //grab queried storage
  const storage = await prisma.storage.findUnique({
    where: {
      id: Number(context.params?.storageId),
    },
    include: {
      group: {
        include: {
          items: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      itemRelations: {
        include: {
          item: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
  });
  //redirect if invalid storageId
  if (storage == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
  //return props
  return {
    props: {
      storage,
      items: storage.group.items,
    },
  };
};
