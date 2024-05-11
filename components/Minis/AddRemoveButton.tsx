import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { AspectRatio, Icon, IconButton } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FiHome, FiMinus, FiPlus } from "react-icons/fi";

type AddRemoveButtonProps = {
  mode: number;
  handleAdd?: MouseEventHandler<HTMLButtonElement>;
  handleRemove?: MouseEventHandler<HTMLButtonElement>;
};
export default function AddRemoveButton({
  mode,
  handleAdd,
  handleRemove,
}: AddRemoveButtonProps) {
  return (
    <Icon
      //---color
      // bg={mode == 1 ? "green.300" : "red.300"}
      // _hover={{ bg: mode == 1 ? "green.400" : "red.400" }}
      bg="white"
      transition=""
      _hover={{ bg: mode == 1 ? "teal.300" : "red.400", color: "white" }}
      // _hover={{ bg: "blue.200" }}
      color="black"
      //---border
      // rounded="md"
      // roundedLeft="none"
      rounded="xl"
      borderColor={"grey.200"}
      borderWidth={"1px"}
      //---display
      as={mode == 1 ? FiPlus : FiMinus}
      // boxSize={"10"}
      display={mode == 0 ? "none" : ""}
      // minW="12"
      // maxW="12"
      // minH="12"
      // maxH="12"
      boxSize={"10"}
      p="2.5"
      //---misc
      onClick={(e) => {
        e.stopPropagation(); //if parent element is clicked, it will be ignored, so that this action activates instead.
        return mode == 1 ? handleAdd : handleRemove;
      }}
      aria-label={""}
    />
  );
}

{
  /* <IconButton
      //color
      bg={mode == 1 ? "green.300" : "red.300"}
      _hover={{ bg: mode == 1 ? "green.400" : "red.400" }}
      color="white"
      aria-label={mode == 1 ? "add" : "delete"}
      //display
      icon={mode == 1 ? <SmallAddIcon /> : <SmallCloseIcon />}
      w={"40px"}
      display={mode == 0 ? "none" : ""}
      //misc
      rounded="md"
      roundedLeft="none"
      onClick={mode == 1 ? handleAdd : handleRemove}
    /> */
}
