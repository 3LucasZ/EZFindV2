import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type PageProps = {
  onClose: () => void;
  isOpen: boolean;
  actionStr?: string;
  protectedAction: () => Promise<void> | void;
};
export default function ConfirmActionModal(props: PageProps) {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Action</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to{" "}
          {props.actionStr ? props.actionStr : "perform this action"}?
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={props.onClose}
            //---color---
            color="white"
            bg="teal.300"
            _hover={{ bg: "teal.400" }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              props.onClose();
              props.protectedAction();
            }}
            ml="2"
            //---color---
            color="white"
            bg="red.300"
            _hover={{ bg: "red.400" }}
          >
            I am sure
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
