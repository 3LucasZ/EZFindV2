import { DeleteIcon, SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import ConfirmActionModal from "../ConfirmActionModal";
import { debugMode } from "services/constants";
import { poster } from "services/poster";

export type UserProps = {
  id: number;
  email: string;
  isAdmin: boolean;
};
type UserWidgetProps = {
  user: UserProps;
  mode: number; //-1: remove, 0: still, 1: add
  handleAdd?: Function;
  handleRemove?: Function;
  confirmModal: boolean;
};

export default function UserWidget(props: UserWidgetProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const action = async () => {
    if (props.mode == 1 && props.handleAdd) {
      props.handleAdd();
    }
    if (props.mode == -1 && props.handleRemove) {
      props.handleRemove();
    }
  };

  return (
    <Flex width="100%">
      <Box
        borderRadius="md"
        bg="orange.200"
        color="white"
        px={4}
        h={8}
        roundedRight="none"
        width="100%"
      >
        <Text width="100%">{props.user.email}</Text>
      </Box>
      <ConfirmActionModal
        isOpen={isOpen}
        onClose={onClose}
        actionStr={
          (props.mode == -1
            ? "revoke admin priveleges from "
            : "grant admin priveleges to ") + props.user.email
        }
        protectedAction={action}
      />
      {(props.mode == -1 || props.mode == 1) && (
        <IconButton
          onClick={() => {
            if (props.confirmModal) onOpen();
            else action();
          }}
          bg={props.mode == 1 ? "green.300" : "red.300"}
          _hover={{ bg: props.mode == 1 ? "green.400" : "red.400" }}
          color="white"
          aria-label={props.mode == 1 ? "add" : "delete"}
          icon={props.mode == 1 ? <SmallAddIcon /> : <SmallCloseIcon />}
          h={8}
          w={"40px"}
          borderRadius="md"
          roundedLeft="none"
        />
      )}
    </Flex>
  );
}
