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
import { IoImageOutline } from "react-icons/io5";
import { ItemProps } from "components/Widget/ItemWidget";
import { GetServerSideProps } from "next";
import { StorageProps } from "components/Widget/StorageWidget";
import ConfirmActionModal from "components/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import UserWidget, { UserProps } from "components/Widget/UserWidget";
import { useState } from "react";
import RelationWidget from "components/Widget/RelationWidget";
import { RelationProps } from "components/Widget/RelationWidget";
import React from "react";
import AutoResizeTextarea from "components/AutoResizeTextarea";
import { poster } from "services/poster";
import Header from "components/Header";
import ImageModal from "components/ImageModal";
import { GroupProps } from "components/Widget/GroupWidget";

type PageProps = {
  group: GroupProps;
  users: UserProps[];
};

export default function ItemPage({ group, users }: PageProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const userGroupRelation = group.userRelations.find(
    (x) => x.userId == session?.user.id
  );
  const perm = userGroupRelation?.perm ? userGroupRelation.perm : 0;
  console.log(perm);

  //toaster
  const toaster = useToast();
  // state: 0=normal, 1=isEdit
  const [isEdit, setIsEdit] = useState(false);
  //newItem state
  const [newName, setNewName] = useState(group.name);
  const [newDescription, setNewDescription] = useState(group.description);
  //   const [newRelations, setNewRelations] = useState(item.relations);
  // handle delete modal
  const {
    isOpen: isOpenTrash,
    onOpen: onOpenTrash,
    onClose: onCloseTrash,
  } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: group.id };
    const res = await poster("/api/delete-group", body, toaster);
    if (res.status == 200) await Router.push({ pathname: "/manage-groups" });
  };
  // handle view modal
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();
  //handle upload image
  const uploadImage = async (imageStr: string) => {
    const body = { id: group.id, newImageStr: imageStr };
    console.log(body);
    const res = await poster("/api/update-group-image", body, toaster);
    if (res.status == 200) Router.reload();
  };
  // handle update item
  const handleUpdateItem = async () => {
    const body = {
      id: group.id,
      newName,
      newDescription,
    };
    const res = await poster("/api/update-group-full", body, toaster);
    if (res.status == 200) Router.reload();
  };

  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <AutoResizeTextarea
          value={isEdit ? newName : group.name}
          onChange={(e) => setNewName(e.target.value)}
          isDisabled={!isEdit}
          maxLength={100}
          fontSize={["2xl", "2xl", "2xl", "3xl", "4xl"]}
          display={"block"}
          _disabled={{ color: "black", borderColor: "white" }}
          textAlign={"center"}
          sx={{ opacity: "1" }}
          py={"5px"}
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
            imageStr={group.image}
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
                  handleUpdateItem();
                } else {
                  setNewName(group.name);
                  setNewDescription(group.description);
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
            actionStr={"delete the group: " + group.name}
            protectedAction={handleDelete}
          />
        </Center>
      </Flex>
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <AutoResizeTextarea
          value={
            isEdit
              ? newDescription
              : group.description
              ? group.description
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
      <SearchView
        setIn={users
          .filter((user) => user.isAdmin)
          .map((user) => ({
            name: user.email,
            widget: (
              <UserWidget
                user={user}
                key={user.id}
                mode={-1}
                handleRemove={async () => {
                  const body = { email: user.email, isAdmin: false };
                  const res = await poster(
                    "/api/update-user-admin",
                    body,
                    toaster
                  );
                  if (res.status == 200) {
                    Router.reload();
                  }
                }}
                confirmModal={true}
              />
            ),
          }))}
        setOut={users
          .filter((user) => !user.isAdmin)
          .map((user) => ({
            name: user.email,
            widget: (
              <UserWidget
                user={user}
                key={user.id}
                mode={1}
                handleAdd={async () => {
                  const body = { email: user.email, isAdmin: true };
                  const res = await poster(
                    "/api/update-user-admin",
                    body,
                    toaster
                  );
                  if (res.status == 200) {
                    Router.reload();
                  }
                }}
                confirmModal={true}
              />
            ),
          }))}
        isAdmin={isAdmin}
        isEdit={false}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const group = await prisma.group.findUnique({
    where: {
      id: Number(context.params?.groupId),
    },
    include: {
      userRelations: true,
    },
  });
  const users = await prisma.user.findMany();
  return {
    props: {
      group,
      users,
    },
  };
};