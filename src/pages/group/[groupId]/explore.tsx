import {
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  Icon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { IoImageOutline } from "react-icons/io5";
import { GetServerSideProps } from "next";
import ConfirmActionModal from "components/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
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
import EditableTitle from "components/Minis/EditableTitle";
import { RouteButton } from "components/RouteButton";
import { FaBoxes, FaTools } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

type PageProps = {
  group: GroupProps;
  users: UserProps[];
};

export default function GroupPage({ group, users }: PageProps) {
  const { data: session, status, update } = useSession();
  const isAdmin = session?.user.isAdmin;
  const userGroupRelation = group.userRelations?.find(
    (x) => x.userId == session?.user.id
  );
  const perm =
    isAdmin == true
      ? 2
      : Math.max(
          group.minPerm,
          userGroupRelation?.perm != undefined ? userGroupRelation.perm : -1
        );
  const toaster = useToast();
  //--state--
  const [isEdit, setIsEdit] = useState(false);
  //change metadata
  const [newName, setNewName] = useState(group.name);
  const [newDescription, setNewDescription] = useState(group.description);
  const [newUserRelations, setNewRelations] = useState(group.userRelations);
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
    // console.log(body);
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
  //prefix
  const prefix = "/group/" + group.id + "/";
  console.log(group.userRelations, userGroupRelation?.perm, perm);
  return (
    <Layout
      isAdmin={session?.user.isAdmin}
      loading={status === "loading"}
      authorized={perm > -1}
    >
      <Flex px={[2, "5vw", "10vw", "15vw"]}>
        <EditableTitle value={group.name} isDisabled={true} />

        {/* <Center>
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
        </Center> */}
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
      <SimpleGrid
        columns={[1, 2, 3]}
        spacing={10}
        pt="15"
        overflowY="auto"
        flexDir={"column"}
      >
        <RouteButton
          route={prefix + "manage-items"}
          text={"Items"}
          icon={FaTools}
          color={"cyan.300"}
          hoverColor={"cyan.100"}
        ></RouteButton>
        <RouteButton
          route={prefix + "manage-storages"}
          text={"Storages"}
          icon={FaBoxes}
          color={"blue.300"}
          hoverColor={"blue.100"}
        ></RouteButton>
        <RouteButton
          route={prefix + "settings"}
          text={"Settings"}
          icon={IoIosSettings}
          color={"orange.400"}
          hoverColor={"orange.100"}
        ></RouteButton>
      </SimpleGrid>
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
