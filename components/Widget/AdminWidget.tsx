import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { debugMode } from "services/constants";
import { poster } from "services/poster";

export type AdminProps = {
  id: number;
  email: string;
};

const AdminWidget: React.FC<{
  admin: AdminProps;
}> = ({ admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toaster = useToast();
  const handleDelete = async () => {
    const body = { id: admin.id };
    const res = await poster("/api/delete-admin", body, toaster);
    if (res.status == 200) {
      Router.reload();
    }
  };
  return (
    <Flex width="100%">
      <Box
        borderRadius="md"
        bg="teal.300"
        color="white"
        px={4}
        h={8}
        roundedRight="none"
        width="100%"
      >
        <Text width="100%">{admin.email}</Text>
      </Box>
      <IconButton
        onClick={onOpen}
        colorScheme="red"
        aria-label="delete"
        icon={<DeleteIcon />}
        h={8}
        roundedLeft="none"
        borderRadius="md"
      />
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        name={" the admin: " + admin.email}
        handleDelete={handleDelete}
      />
    </Flex>
  );
};

export default AdminWidget;
