import {
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  Icon,
} from "@chakra-ui/icons";
import { IoImageOutline } from "react-icons/io5";
import { GetServerSideProps } from "next";
import ConfirmActionModal from "components/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useState } from "react";
import React from "react";
import AutoResizeTextarea from "components/AutoResizeTextarea";
import { poster } from "services/poster";
import ImageModal from "components/ImageModal";
import { GroupProps } from "components/Widget/GroupWidget";
import UserGroupRelationWidget, {
  UserGroupRelationProps,
} from "components/Widget/UserGroupRelationWidget";

type PageProps = {
  group: GroupProps;
  users: UserProps[];
};

export default function GroupPage({ group, users }: PageProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const userGroupRelation = group.userRelations.find(
    (x) => x.userId == session?.user.id
  );
  const perm = isAdmin
    ? 2
    : Math.max(
        group.minPerm,
        userGroupRelation?.perm ? userGroupRelation.perm : 0
      );
  const toaster = useToast();
  //--state--
  const [isEdit, setIsEdit] = useState(false);
  //change metadata
  const [newName, setNewName] = useState(group.name);
  const [newDescription, setNewDescription] = useState(group.description);
  const [newUserRelations, setNewRelations] = useState(group.userRelations);
  //track widgets
  const inRelations = isEdit ? newUserRelations : group.userRelations;
  const inIds = inRelations.map((relation) => relation.userId);
  const outRelations: UserGroupRelationProps[] = users
    .filter((user) => !inIds.includes(user.id))
    .map((user) => {
      return {
        user: user,
        userId: user.id,
        group: group,
        groupId: group.id,
        perm: 0,
      };
    });
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
  // handle update
  const handleUpdateGroup = async () => {
    const body = {
      id: group.id,
      newName,
      newDescription,
      newUserRelations,
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
          {perm >= 1 && (
            <IconButton
              ml={2}
              mr={2}
              colorScheme="teal"
              aria-label=""
              icon={isEdit ? <CheckIcon /> : <EditIcon />}
              onClick={async () => {
                if (isEdit) {
                  handleUpdateGroup();
                } else {
                  setNewName(group.name);
                  setNewDescription(group.description);
                  setIsEdit(true);
                }
              }}
            />
          )}
          {perm >= 1 && (
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
      <Center>
        <Text fontSize={["xl", "xl", "xl", "2xl", "2xl"]} pb="2">
          Group Permissions
        </Text>
      </Center>
      <SearchView
        setIn={inRelations.map((relation) => ({
          name: relation.user.name,
          rank: 3 - relation.perm + relation.user.name,
          widget: (
            <UserGroupRelationWidget
              user={relation.user}
              perm={relation.perm}
              isEdit={isEdit && perm >= 2}
              isInvert={false}
              handleRemove={() => {
                setNewRelations(
                  newUserRelations.filter((t) => t.userId != relation.userId)
                );
              }}
              handleUpdate={(newPerm: number) => {
                const copy = newUserRelations.map((x) => ({ ...x }));
                console.log(copy);
                const tar = copy.find((x) => x.user.id == relation?.user.id);
                if (tar != null) {
                  tar.perm = newPerm;
                  setNewRelations(copy);
                }
              }}
            />
          ),
        }))}
        setOut={outRelations.map((relation) => ({
          name: relation.user.name,
          rank: 3 - relation.perm + relation.user.name,
          widget: (
            <UserGroupRelationWidget
              user={relation.user}
              perm={relation.perm}
              isEdit={isEdit && perm >= 2}
              isInvert={true}
              handleAdd={() => {
                const copy = [...newUserRelations];
                copy.push(relation);
                setNewRelations(copy);
              }}
            />
          ),
        }))}
        isAdmin={isAdmin}
        isEdit={isEdit}
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
      userRelations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
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