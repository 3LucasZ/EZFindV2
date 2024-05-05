import {
  Box,
  Container,
  Flex,
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import Layout from "components/Layout/MainLayout";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { UserProps } from "components/Widget/UserWidget";
import { useState } from "react";
import React from "react";
import AutoResizeTextarea from "components/Minis/AutoResizeTextarea";
import { poster } from "services/poster";
import { GroupProps } from "components/Widget/GroupWidget";
import EditableTitle from "components/Minis/EditableTitle";
import Carousel from "components/Main/Carousel";
import EditableSubtitle from "components/Minis/EditableSubtitle";
import { CustomStat } from "components/Main/CustomStat";

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
  const stats = [
    { label: "Items", value: "73" },
    { label: "Storages", value: "56" },
    { label: "Users", value: "12" },
  ];
  console.log(group.userRelations, userGroupRelation?.perm, perm);
  return (
    <Layout
      isAdmin={session?.user.isAdmin}
      loading={status === "loading"}
      authorized={perm > -1}
      group={group}
    >
      <Box overflow={"auto"}>
        <Flex px={[2, "5vw", "10vw", "15vw"]}>
          <EditableTitle value={group.name} isDisabled={true} />
        </Flex>
        <Flex px={[2, "5vw", "10vw", "15vw"]}>
          <EditableSubtitle
            value={group.description ? group.description : "No description."}
            disabled
          />
        </Flex>
        <Box as="section" py={{ base: "4", md: "8" }}>
          <Container>
            <SimpleGrid
              columns={{ base: 3, md: 3 }}
              gap={{ base: "5", md: "6" }}
            >
              {stats.map(({ label, value }) => (
                <CustomStat key={label} label={label} value={value} />
              ))}
            </SimpleGrid>
          </Container>
        </Box>
        <Box px={[2, "5vw", "10vw", "15vw"]}>
          <Carousel />
        </Box>

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
