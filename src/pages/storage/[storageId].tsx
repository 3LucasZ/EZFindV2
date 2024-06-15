import {
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, Icon } from "@chakra-ui/icons";
import { SlPrinter } from "react-icons/sl";
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
import { IoImageOutline } from "react-icons/io5";
import ImageModal from "components/Main/ImageModal";
import EditableTitle from "components/Composable/EditableTitle";
import EditableSubtitle from "components/Composable/EditableSubtitle";
import { GroupProps } from "@/db";
import ShortSearchWidget from "components/Widget/ItemStorageWidget";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import { cloneItemStorageRelationProps } from "services/clone";
import { getGroupPerm } from "services/utils";
import { responsivePx } from "services/constants";

type PageProps = {
  storage: StorageProps;
  items: ItemProps[];
  group: GroupProps;
};

export default function StoragePage({ storage, items, group }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const groupPerm = getGroupPerm(me, group);
  const [isEdit, setIsEdit] = useState(false);
  //new state
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
    if (res.status == 200)
      await Router.push({ pathname: `/group/${group.id}/manage-storages` });
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

  //widget generator
  function genWidget(
    relation: ItemStorageRelationProps,
    inverted: boolean,
    isEdit: boolean
  ) {
    return {
      name: relation.item.name,
      rank: relation.item.name,
      inverted: inverted,
      widget: (
        <ShortSearchWidget
          name={relation.item.name}
          description={relation.item.description}
          image={relation.item.image}
          count={relation.count}
          url={`/item/${relation.item.id}`}
          inverted={inverted}
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
              newRelations.filter((t) => t.itemId != relation.itemId)
            );
          }}
          handleNewCount={(e) => {
            const copy = newRelations.map((a) => ({ ...a }));
            const tar = copy.find((t) => t.itemId == relation.itemId);
            if (tar != null) {
              tar.count = Number(e.target.value);
              setNewRelations(copy);
            }
          }}
          key={relation.itemId}
        />
      ),
    };
  }

  return (
    <Layout
      me={me}
      loaded={status !== "loading"}
      authorized={me?.isAdmin}
      group={group}
    >
      <Flex px={responsivePx}>
        <EditableTitle
          value={isEdit ? newName : storage.name}
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
              canUpload={groupPerm >= 1} //PROTECTED
              imageStr={storage.image}
            />
            {groupPerm >= 1 && (
              <IconButton
                colorScheme="red"
                aria-label=""
                icon={<DeleteIcon />}
                onClick={onOpenTrash}
                hidden={groupPerm < 1}
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
      <Flex px={responsivePx}>
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
          set={[
            ...inRelations.map((relation) =>
              genWidget(relation, false, isEdit)
            ),
            ...outRelations.map((relation) =>
              genWidget(relation, true, isEdit)
            ),
          ]}
          invertible={true}
        />
      )}
      {groupPerm >= 1 && (
        <EditFAB
          isEdit={isEdit}
          onEdit={() => {
            setNewName(storage.name);
            setNewDescription(storage.description);
            setNewRelations(storage.itemRelations);
            setIsEdit(true);
          }}
          onSave={handleUpdateStorage}
          onCancel={() => setIsEdit(false)}
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
          items: true,
          userRelations: true,
        },
      },
      itemRelations: {
        include: {
          item: true,
        },
      },
    },
  });

  //redirect if invalid id
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
      group: storage.group,
    },
  };
};
