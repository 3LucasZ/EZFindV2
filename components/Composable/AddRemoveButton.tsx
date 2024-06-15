import { Icon, useDisclosure } from "@chakra-ui/react";
import ConfirmActionModal from "components/Main/ConfirmActionModal";
import { FiPlus, FiX } from "react-icons/fi";

type AddRemoveButtonProps = {
  mode: number;
  invisible?: boolean;
  handleAdd?: Function;
  handleRemove?: Function;
  askConfirmation?: boolean;
  actionStr?: string;
};
export default function AddRemoveButton({
  mode,
  invisible,
  handleAdd,
  handleRemove,
  askConfirmation,
  actionStr,
}: AddRemoveButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const action = () =>
    mode == 1 ? handleAdd && handleAdd() : handleRemove && handleRemove();
  return (
    <>
      <Icon
        //---color
        bg="white"
        transition=""
        _hover={{ bg: mode == 1 ? "teal.300" : "red.400", color: "white" }}
        color="black"
        //---border
        rounded="xl"
        borderColor={"gray.200"}
        borderWidth={"1px"}
        //---display
        as={mode == 1 ? FiPlus : FiX}
        display={mode == 0 ? "none" : ""}
        opacity={invisible ? 0 : 1}
        boxSize={"10"}
        p="2.5"
        //---misc
        onClick={(e) => {
          e.stopPropagation(); //if parent element is clicked, it will be ignored, so that this action activates instead.
          askConfirmation ? onOpen() : action();
        }}
        aria-label={""}
      />
      <ConfirmActionModal
        isOpen={isOpen}
        onClose={onClose}
        protectedAction={action}
        actionStr={actionStr}
      />
    </>
  );
}
