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
import { ItemProps } from "types/db";
import { GetServerSideProps } from "next";
import { StorageProps } from "types/db";
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
import { GroupProps } from "components/Widget/GroupWidget";
import ShortSearchWidget from "components/Widget/ShortSearchWidget";
import { FAB } from "components/Layout/FAB/FAB";
import { FiCheck, FiEdit2 } from "react-icons/fi";
import { EditFAB } from "components/Layout/FAB/EditFAB";

type PageProps = {
  storage: StorageProps;
  items: ItemProps[];
  group: GroupProps;
};

export default function StoragePage({ storage, items, group }: PageProps) {
  //--copy paste on every page--
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const userGroupRelation = group.userRelations?.find(
    (x) => x.userId == session?.user.id
  );
  const pagePerm = isAdmin
    ? 2
    : Math.max(
        group.minPerm,
        userGroupRelation?.perm ? userGroupRelation.perm : -1
      );
  const toaster = useToast();
  //--state--
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
          mode={isEdit ? (inverted ? 1 : -1) : 0}
          handleAdd={() => {
            const copy = [...newRelations];
            copy.push(relation);
            setNewRelations(copy);
          }}
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
  }

  return (
    <Layout isAdmin={session?.user.isAdmin} group={storage.group}>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
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
              imageStr={storage.image}
            />

            <IconButton
              colorScheme="red"
              aria-label=""
              icon={<DeleteIcon />}
              onClick={onOpenTrash}
              hidden={pagePerm < 1}
            />

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
          set={[
            ...inRelations.map((relation) =>
              genWidget(relation, false, isEdit)
            ),
            ...outRelations.map((relation) =>
              genWidget(relation, true, isEdit)
            ),
          ]}
          invertible={true}
          isEdit={isEdit}
        />
      )}
      {pagePerm >= 1 && (
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
      group: storage.group,
    },
  };
};
