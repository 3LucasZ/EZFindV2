import {
  AbsoluteCenter,
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { GroupProps } from "@/db";
import EditableSubtitle from "components/Composable/EditableSubtitle";
import EditableTitle from "components/Composable/EditableTitle";
import Carousel from "components/Main/Carousel";
import { CustomStat } from "components/Main/CustomStat";
import { User } from "next-auth";
import { useEffect } from "react";
import { FiCompass, FiPackage, FiTool, FiUsers } from "react-icons/fi";
import { responsivePx } from "services/constants";
import { getGroupPerm } from "services/utils";

type PageProps = {
  group: GroupProps;
  users: User[];
};

export default function GroupPage({ group, users }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const groupPerm = getGroupPerm(session?.user, group);
  console.log("groupPerm", groupPerm);
  //--ret--
  return (
    <Layout
      me={me}
      loaded={status !== "loading"}
      authorized={groupPerm >= 0}
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
              cards={
                group
                  .items!.map((item) => ({
                    image: item.image,
                    title: item.name,
                    url: "/item/" + item.id,
                  }))
                  .reverse() //this forces last edited to be shown first
              }
            />
            <Carousel
              cards={
                group
                  .storages!.map((storage) => ({
                    image: storage.image,
                    title: storage.name,
                    url: "/storage/" + storage.id,
                  }))
                  .reverse() //this forces last edited to be shown first
              }
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
