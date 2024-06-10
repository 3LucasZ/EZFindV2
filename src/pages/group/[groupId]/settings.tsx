import {
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
  Text,
  HStack,
  useRadioGroup,
  Box,
  ButtonGroup,
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
import ConfirmActionModal from "components/Main/ConfirmActionModal";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import SearchView from "components/Main/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "types/db";
import { useState } from "react";
import React from "react";
import AutoResizeTextarea from "components/Composable/AutoResizeTextarea";
import { poster } from "services/poster";
import ImageModal from "components/Main/ImageModal";
import { GroupProps } from "components/Widget/GroupWidget";
import { UserGroupRelationProps } from "types/db";
import RadioCard from "components/Main/RadioCard";
import { IoIosLock } from "react-icons/io";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FiEye, FiLock, FiUsers } from "react-icons/fi";
import { getGroupPerm } from "services/utils";
import { cloneUserGroupRelationProps } from "services/clone";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import UserWidget from "components/Widget/UserWidget";
import { responsiveHeaderFontSize, responsivePx } from "services/constants";

type PageProps = {
  group: GroupProps;
  users: UserProps[];
};

export default function GroupPage({ group, users }: PageProps) {
  //--default--
  const { data: session, status } = useSession();
  const { isAdmin, pagePerm } = getGroupPerm(session?.user, group);
  const toaster = useToast();

  //--state--
  const [isEdit, setIsEdit] = useState(false);

  //--new state--
  const [newName, setNewName] = useState(group.name);
  const [newDescription, setNewDescription] = useState(group.description);
  const [newRelations, setNewRelations] = useState(group.userRelations);
  const [newMinPerm, setNewMinPerm] = useState("" + group.minPerm);

  //--relations--
  const inRelations = isEdit ? newRelations : group.userRelations;
  const inIds = inRelations?.map((relation) => relation.userId);
  const outRelations: UserGroupRelationProps[] = users
    .filter((user) => !inIds?.includes(user.id))
    .map((user) => {
      return {
        user: user,
        userId: user.id,
        group: group,
        groupId: group.id,
        perm: 0, //new users added to a group auto start at perm: 0
        inverted: true,
      };
    });

  //--handle delete modal--
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
    body = { image: group.image };
    res = await poster("/api/delete-image", body, toaster, false, true);
    if (res.status == 200) {
      //upload new image
      body = { image: newImage };
      res = await poster("/api/upload-image", body, toaster, false, true);
      const imageUrl = await res.json();
      console.log("upload-image-client fileUrl:", imageUrl);
      if (res.status == 200) {
        //attach new image to group
        const body = { id: group.id, image: imageUrl };
        const res = await poster("/api/update-group-image", body, toaster);
        if (res.status == 200) {
          Router.reload();
        }
      }
    }
  };

  //--handle radio group--
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    value: isEdit ? newMinPerm : "" + group.minPerm,
    onChange: (e) => {
      //PROTECTED
      if (isEdit && pagePerm >= 2) {
        setNewMinPerm(e);
      }
    },
  });
  const rootProps = getRootProps();
  const options = [
    {
      value: "-1",
      name: "Private",
      desc: "Restricted access",
      icon: FiLock,
    },
    {
      value: "0",
      name: "Public",
      desc: "Anyone can view",
      icon: FiEye,
    },
    {
      value: "1",
      name: "Open",
      desc: "Anyone can view or edit",
      icon: FiUsers,
    },
  ];

  //--handle update--
  const handleUpdateGroup = async () => {
    const body = {
      id: group.id,
      newName,
      newDescription,
      newUserRelations: newRelations,
      newMinPerm,
    };
    const res = await poster("/api/update-group-full", body, toaster);
    if (res.status == 200) Router.reload();
  };
  console.log(users);

  //--ret--
  return (
    <Layout isAdmin={isAdmin} group={group} loading={status === "loading"}>
      <Flex px={responsivePx}>
        <AutoResizeTextarea
          value={isEdit ? newName : group.name}
          onChange={(e) => setNewName(e.target.value)}
          isDisabled={!isEdit}
          maxLength={100}
          fontSize={responsiveHeaderFontSize}
          display={"block"}
          _disabled={{ color: "black", borderColor: "white" }}
          textAlign={"center"}
          sx={{ opacity: "1" }}
          py={"5px"}
        />

        <Center>
          <ButtonGroup spacing="2" pl="2" isAttached>
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
              canUpload={pagePerm >= 1} //PROTECTED
              imageStr={group.image}
            />

            {pagePerm >= 2 && ( //PROTECTED
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
              actionStr={"delete the group: " + group.name}
              protectedAction={handleDelete}
            />
          </ButtonGroup>
        </Center>
      </Flex>
      <Box h="2px"></Box>
      <Flex px={responsivePx}>
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
      {/* <Center>
        <Text fontSize={["xl", "xl", "xl", "2xl", "2xl"]} pb="2">
          Group Permissions
        </Text>
      </Center> */}
      <Box h="2px"></Box>
      <HStack
        px={responsivePx}
        {...rootProps}
        alignContent={"center"}
        w="100%"
        flexDir={"row"}
      >
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <RadioCard
              key={option.value}
              radioProps={radio}
              name={option.name}
              description={option.desc}
              icon={option.icon}
              disabled={!(isEdit && pagePerm >= 2)}
            />
          );
        })}
      </HStack>
      <Box h="8px"></Box>
      <SearchView
        set={[...inRelations!, ...outRelations].map((relation) => ({
          name: relation.user.name,
          rank: 3 - relation.perm + relation.user.name,
          inverted: relation.inverted,
          widget: (
            <UserWidget
              //data
              name={relation.user.name}
              email={relation.user.email}
              image={relation.user.image}
              perm={relation.perm}
              isAdmin={relation.user.isAdmin}
              //state
              isEdit={isEdit && pagePerm >= 2} //PROTECTED
              inverted={relation.inverted!}
              handleAdd={() => {
                const relationCpy = cloneUserGroupRelationProps(relation);
                relationCpy.inverted = false;
                setNewRelations([...newRelations!, relationCpy]);
              }}
              handleRemove={() => {
                setNewRelations(
                  newRelations?.filter((t) => t.userId != relation.userId)
                );
              }}
              handleNewPerm={(newPerm: number) => {
                const copy = newRelations?.map((x) => ({ ...x }));
                const tar = copy?.find((x) => x.user.id == relation?.user.id);
                if (tar != null) {
                  tar.perm = newPerm;
                  setNewRelations(copy);
                }
              }}
            />
          ),
        }))}
        invertible={true}
      />
      {pagePerm >= 1 && ( //PROTECTED
        <EditFAB
          isEdit={isEdit}
          onEdit={() => {
            setNewName(group.name);
            setNewDescription(group.description);
            setNewMinPerm("" + group.minPerm);
            setNewRelations(group.userRelations);
            setIsEdit(true);
          }}
          onCancel={() => setIsEdit(false)}
          onSave={handleUpdateGroup}
        />
      )}
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
          user: true,
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
