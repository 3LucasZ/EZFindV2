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
import ConfirmActionModal from "../Main/ConfirmActionModal";
import { debugMode } from "services/constants";
import { poster } from "services/poster";
import AddRemoveButton from "components/Minis/AddRemoveButton";
import { UserProps } from "types/db";

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
        rounded="md"
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
        <AddRemoveButton
          mode={props.mode}
          handleAdd={() => {
            if (props.confirmModal) onOpen();
            else action();
          }}
          handleRemove={() => {
            if (props.confirmModal) onOpen();
            else action();
          }}
        />
      )}
    </Flex>
  );
}
