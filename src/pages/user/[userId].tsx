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
import { UserProps } from "types/db";
import { useState } from "react";
import RelationWidget from "components/Widget/ItemStorageRelationWidget";
import { ItemStorageRelationProps } from "types/db";
import React from "react";
import AutoResizeTextarea from "components/Composable/AutoResizeTextarea";
import { poster } from "services/poster";
import Header from "components/Layout/Header";
import ImageModal from "components/Main/ImageModal";
import EditableTitle from "components/Composable/EditableTitle";
import EditableSubtitle from "components/Composable/EditableSubtitle";

type PageProps = {
  user: UserProps;
};

export default function UserPage({ user }: PageProps) {
  const { data: session, status } = useSession();
  const toaster = useToast();

  return <Layout isAdmin={session?.user.isAdmin}>Hi</Layout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  var user = await prisma.user.findUnique({
    where: {
      id: String(context.params?.userId),
    },
  });

  return {
    props: {
      user,
    },
  };
};
