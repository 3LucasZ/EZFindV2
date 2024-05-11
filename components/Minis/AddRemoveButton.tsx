import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { AspectRatio, Icon, IconButton } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FiHome, FiMinus, FiPlus } from "react-icons/fi";

type AddRemoveButtonProps = {
  mode: number;
  handleAdd?: Function;
  handleRemove?: Function;
};
export default function AddRemoveButton({
  mode,
  handleAdd,
  handleRemove,
}: AddRemoveButtonProps) {
  return (
    <Icon
      //---color
      bg="white"
      transition=""
      _hover={{ bg: mode == 1 ? "teal.300" : "red.400", color: "white" }}
      color="black"
      //---border
      rounded="xl"
      borderColor={"grey.200"}
      borderWidth={"1px"}
      //---display
      as={mode == 1 ? FiPlus : FiMinus}
      display={mode == 0 ? "none" : ""}
      boxSize={"10"}
      p="2.5"
      //---misc
      onClick={(e) => {
        e.stopPropagation(); //if parent element is clicked, it will be ignored, so that this action activates instead.
        mode == 1 ? handleAdd && handleAdd() : handleRemove && handleRemove();
      }}
      aria-label={""}
    />
  );
}
