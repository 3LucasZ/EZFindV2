import {
  AbsoluteCenter,
  Box,
  Container,
  Divider,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "types/db";
import { useState } from "react";
import React from "react";
import AutoResizeTextarea from "components/Composable/AutoResizeTextarea";
import { poster } from "services/poster";
import { GroupProps } from "components/Widget/GroupWidget";
import EditableTitle from "components/Composable/EditableTitle";
import Carousel from "components/Main/Carousel";
import EditableSubtitle from "components/Composable/EditableSubtitle";
import { CustomStat } from "components/Main/CustomStat";
import { FiCompass, FiPackage, FiTool, FiUsers } from "react-icons/fi";
import { responsivePx } from "services/constants";

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
  return (
    <Layout
      isAdmin={session?.user.isAdmin}
      loading={status === "loading"}
      authorized={perm > -1}
      group={group}
    >
      <Box overflow={"auto"}>
        <Flex px={responsivePx} flexDir="column">
          <EditableTitle value={group.name} isDisabled={true} />
          <EditableSubtitle
            value={group.description ? group.description : "No description."}
            disabled
          />
        </Flex>
        <SimpleGrid
          columns={3}
          gap={[2, 4, 6]}
          px={responsivePx}
          py={[4, 6, 8]}
        >
          <CustomStat
            label={"Items"}
            value={"" + group.items?.length}
            link={`/group/${group.id}/manage-items`}
            icon={FiTool}
            dark="cyan.400"
            med="cyan.200"
            light="cyan.100"
            xlight="cyan.50"
          />
          <CustomStat
            label={"Storages"}
            value={"" + group.storages?.length}
            link={`/group/${group.id}/manage-storages`}
            icon={FiPackage}
            dark="blue.400"
            med="blue.200"
            light="blue.100"
            xlight="blue.50"
          />
          <CustomStat
            label={"Members"}
            value={"" + group.userRelations?.length}
            link={`/group/${group.id}/settings`}
            icon={FiUsers}
            dark="orange.400"
            med="orange.200"
            light="orange.100"
            xlight="orange.50"
          />
        </SimpleGrid>
        {group.items!.length > 0 && group.storages!.length > 0 && (
          <Box px={responsivePx}>
            <Box position="relative" py={8} px={2}>
              <Divider />
              <AbsoluteCenter bg="white">
                <HStack color="blue.300" px="3">
                  <Icon as={FiCompass} boxSize={6} />
                  <Text fontSize="xl">Explore</Text>
                </HStack>
              </AbsoluteCenter>
            </Box>
            <Carousel
              cards={group.items!.map((item) => ({
                image: item.image,
                title: item.name,
                url: "/item/" + item.id,
              }))}
            />
            <Carousel
              cards={group.storages!.map((storage) => ({
                image: storage.image,
                title: storage.name,
                url: "/storage/" + storage.id,
              }))}
            />
          </Box>
        )}

        <Box h="60px" />
      </Box>
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
      items: true,
      storages: true,
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

{
  /* <SimpleGrid
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
</SimpleGrid> */
}
{
  /* 
   // handle view modal
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();
  
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
</Center> 

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
*/
}
