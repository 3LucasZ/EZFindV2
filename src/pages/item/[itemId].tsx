import {
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, Icon } from "@chakra-ui/icons";
import { IoImageOutline } from "react-icons/io5";
import { ItemProps } from "types/db";
import { GetServerSideProps } from "next";
import { StorageProps } from "types/db";
import ConfirmActionModal from "components/Main/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import SearchView from "components/Main/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { useEffect, useState } from "react";
import { ItemStorageRelationProps } from "types/db";
import React from "react";
import { poster } from "services/poster";
import ImageModal from "components/Main/ImageModal";
import EditableTitle from "components/Composable/EditableTitle";
import EditableSubtitle from "components/Composable/EditableSubtitle";
import { TiShoppingCart } from "react-icons/ti";
import { GroupProps } from "components/Widget/GroupWidget";
import ShortSearchWidget from "components/Widget/ItemStorageWidget";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import { cloneItemStorageRelationProps } from "services/clone";
import { getGroupPerm } from "services/utils";
import { responsivePx } from "services/constants";

type PageProps = {
  item: ItemProps;
  storages: StorageProps[];
  group: GroupProps;
};

export default function ItemPage({ item, storages, group }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const groupPerm = getGroupPerm(session?.user, group);
  const [isEdit, setIsEdit] = useState(false);
  //--new state--
  const [newName, setNewName] = useState(item.name);
  const [newDescription, setNewDescription] = useState(item.description);
  const [newRelations, setNewRelations] = useState(item.storageRelations);
  const [newLink, setNewLink] = useState(item.link);
  //--in and out relations--
  const inRelations = isEdit ? newRelations : item.storageRelations;
  const inIds = inRelations.map((relation) => relation.storageId);
  const outRelations = storages
    .filter((storage) => !inIds.includes(storage.id))
    .map((storage) => {
      return {
        item: item,
        itemId: item.id,
        storage: storage,
        storageId: storage.id,
        count: 0,
        inverted: true,
      };
    });
  //--handle link modal--
  const {
    isOpen: isOpenLink,
    onOpen: onOpenLink,
    onClose: onCloseLink,
  } = useDisclosure();
  //--handle delete modal--
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
  //--handle view modal--
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();
  //--handle upload image--
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
  //--handle update item--
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
  //--ret--
  return (
    <Layout
      me={me}
      loaded={status !== "loading"}
      authorized={groupPerm >= 1}
      group={group}
    >
      <Flex px={responsivePx}>
        <EditableTitle
          value={isEdit ? newName : item.name}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewName(e.target.value)
          }
          isDisabled={!isEdit}
        />
        <Center>
          <ButtonGroup spacing="2" pl="2" isAttached>
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
              canUpload={groupPerm >= 1} //PROTECTED
              imageStr={item.image}
            />
            {groupPerm >= 1 && ( //PROTECTED
              <IconButton
                colorScheme="red"
                aria-label=""
                icon={<DeleteIcon />}
                onClick={onOpenTrash}
              />
            )}
            <ConfirmActionModal
              isOpen={isOpenTrash}
              onClose={onCloseTrash}
              actionStr={"delete the item: " + item.name}
              protectedAction={handleDelete}
            />
          </ButtonGroup>
        </Center>
      </Flex>
      <Flex px={responsivePx} flexDir="column">
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
          set={[...inRelations, ...outRelations].map((relation) => ({
            name: relation.storage.name,
            rank: relation.storage.name,
            inverted: relation.inverted,
            widget: (
              <ShortSearchWidget
                name={relation.storage.name}
                description={relation.storage.description}
                image={relation.storage.image}
                count={relation.count}
                url={`/storage/${relation.storage.id}`}
                inverted={relation.inverted}
                isEdit={isEdit}
                handleAdd={() => {
                  const relationCpy = cloneItemStorageRelationProps(relation);
                  relationCpy.inverted = false;
                  const copy = [...newRelations];
                  copy.push(relationCpy);
                  setNewRelations(copy);
                }}
                handleRemove={() => {
                  setNewRelations(
                    newRelations.filter(
                      (t) => t.storageId != relation.storageId
                    )
                  );
                }}
                handleNewCount={(e) => {
                  const copy = newRelations.map((a) => ({ ...a }));
                  const tar = copy.find(
                    (t) => t.storageId == relation.storageId
                  );
                  if (tar != null) {
                    tar.count = Number(e.target.value);
                    setNewRelations(copy);
                  }
                }}
                key={relation.storageId}
              />
            ),
          }))}
          invertible={true}
        />
      )}
      {groupPerm >= 1 && (
        <EditFAB
          isEdit={isEdit}
          onEdit={() => {
            setNewName(item.name);
            setNewDescription(item.description);
            setNewLink(item.link);
            setNewRelations(item.storageRelations);
            setIsEdit(true);
          }}
          onSave={handleUpdateItem}
          onCancel={() => setIsEdit(false)}
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
          storages: true,
          userRelations: true,
        },
      },
      storageRelations: {
        include: {
          storage: true,
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
