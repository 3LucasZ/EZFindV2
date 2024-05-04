import {
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
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
import { IoImageOutline } from "react-icons/io5";
import { ItemProps } from "components/Widget/ItemWidget";
import { GetServerSideProps } from "next";
import { StorageProps } from "components/Widget/StorageWidget";
import ConfirmActionModal from "components/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useState } from "react";
import RelationWidget from "components/Widget/ItemStorageRelationWidget";
import { ItemStorageRelationProps } from "components/Widget/ItemStorageRelationWidget";
import React from "react";
import AutoResizeTextarea from "components/AutoResizeTextarea";
import { poster } from "services/poster";
import Header from "components/Header";
import ImageModal from "components/ImageModal";
import EditableTitle from "components/Minis/EditableTitle";
import EditableSubtitle from "components/Minis/EditableSubtitle";
import { TiShoppingCart } from "react-icons/ti";
import { GroupProps } from "components/Widget/GroupWidget";

type PageProps = {
  item: ItemProps;
  storages: StorageProps[];
  group: GroupProps;
};

export default function ItemPage({ item, storages, group }: PageProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const userGroupRelation = group.userRelations?.find(
    (x) => x.userId == session?.user.id
  );
  const perm = isAdmin
    ? 2
    : Math.max(
        group.minPerm,
        userGroupRelation?.perm ? userGroupRelation.perm : -1
      );
  console.log(perm);
  const toaster = useToast();
  //--state--
  const [isEdit, setIsEdit] = useState(false);
  //newItem state
  const [newName, setNewName] = useState(item.name);
  const [newDescription, setNewDescription] = useState(item.description);
  const [newRelations, setNewRelations] = useState(item.storageRelations);
  const [newLink, setNewLink] = useState(item.link);
  //track widgets
  const inRelations = isEdit ? newRelations : item.storageRelations;
  const inIds = inRelations.map((relation) => relation.storageId);
  const outRelations: ItemStorageRelationProps[] = storages
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
  //handle link modal
  const {
    isOpen: isOpenLink,
    onOpen: onOpenLink,
    onClose: onCloseLink,
  } = useDisclosure();
  // handle delete modal
  const {
    isOpen: isOpenTrash,
    onOpen: onOpenTrash,
    onClose: onCloseTrash,
  } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: item.id };
    const res = await poster("/api/delete-item", body, toaster);
    if (res.status == 200) await Router.push({ pathname: "/manage-items" });
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
    body = { image: item.image };
    res = await poster("/api/delete-image", body, toaster, false, true);
    if (res.status == 200) {
      //upload new image
      body = { image: newImage };
      res = await poster("/api/upload-image", body, toaster, false, true);
      const imageUrl = await res.json();
      console.log("upload-image-client fileUrl:", imageUrl);
      if (res.status == 200) {
        //attach new image to item
        const body = { id: item.id, image: imageUrl };
        const res = await poster("/api/update-item-image", body, toaster);
        if (res.status == 200) {
          Router.reload();
        }
      }
    }
  };
  // handle update item
  const handleUpdateItem = async () => {
    const body = {
      id: item.id,
      newName,
      newDescription,
      newLink,
      newRelations,
    };
    const res = await poster("/api/update-item-full", body, toaster);
    if (res.status == 200) Router.reload();
  };

  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <EditableTitle
          value={isEdit ? newName : item.name}
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
              icon={<Icon as={TiShoppingCart} boxSize={5} />}
              onClick={onOpenLink}
              isDisabled={item.link == ""}
            />
            <ConfirmActionModal
              isOpen={isOpenLink}
              onClose={onCloseLink}
              actionStr={"visit the website: " + item.link}
              protectedAction={() => {
                window.open(item.link, "_blank");
              }}
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
              imageStr={item.image}
            />
            <IconButton
              colorScheme="teal"
              aria-label=""
              icon={isEdit ? <CheckIcon /> : <EditIcon />}
              onClick={async () => {
                if (isEdit) {
                  handleUpdateItem();
                } else {
                  setNewName(item.name);
                  setNewDescription(item.description);
                  setNewRelations(item.storageRelations);
                  setIsEdit(true);
                }
              }}
              hidden={perm < 1}
            />
            <IconButton
              colorScheme="red"
              aria-label=""
              icon={isEdit ? <CloseIcon /> : <DeleteIcon />}
              onClick={() => {
                if (isEdit) setIsEdit(false);
                else onOpenTrash();
              }}
              hidden={perm < 1}
            />
            <ConfirmActionModal
              isOpen={isOpenTrash}
              onClose={onCloseTrash}
              actionStr={"delete the item: " + item.name}
              protectedAction={handleDelete}
            />
          </ButtonGroup>
        </Center>
      </Flex>
      <Flex px={[2, "5vw", "10vw", "15vw"]} flexDir="column">
        <EditableSubtitle
          value={
            isEdit
              ? newDescription
              : item.description
              ? item.description
              : "No description."
          }
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewDescription(e.target.value)
          }
          isDisabled={!isEdit}
          placeholder="Description"
        />
        <EditableSubtitle
          value={newLink}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewLink(e.target.value)
          }
          hidden={!isEdit}
          placeholder="Purchase link"
        />
      </Flex>

      {status != "loading" && (
        <SearchView
          setIn={inRelations.map((relation) => {
            return {
              name: relation.storage.name,
              rank: relation.storage.name,
              widget: (
                <RelationWidget
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
                  key={relation.storageId}
                />
              ),
            };
          })}
          setOut={outRelations.map((relation) => {
            return {
              name: relation.storage.name,
              rank: relation.storage.name,
              widget: (
                <RelationWidget
                  relation={relation}
                  isItem={false}
                  isInvert={true}
                  isEdit={isEdit}
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
                  key={relation.storageId}
                />
              ),
            };
          })}
          isAdmin={perm < 1}
          isEdit={isEdit}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //grab queried item
  var item = await prisma.item.findUnique({
    where: {
      id: Number(context.params?.itemId),
    },
    include: {
      group: {
        include: {
          storages: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          userRelations: {
            select: {
              perm: true,
              userId: true,
            },
          },
        },
      },
      storageRelations: {
        include: {
          storage: {
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
  //redirect to 404 if url itemId is invalid
  if (item == null) {
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
      item,
      storages: item.group.storages,
      group: item.group,
    },
  };
};
