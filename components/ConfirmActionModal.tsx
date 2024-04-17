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
  actionStr: string;
  protectedAction: () => Promise<void>;
};
export default function ConfirmActionModal(props: PageProps) {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Action</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to {props.actionStr}?</ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} colorScheme="teal">
            No
          </Button>
          <Button
            onClick={() => {
              props.onClose();
              props.protectedAction();
            }}
            colorScheme="red"
            ml="2"
          >
            I am sure
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
