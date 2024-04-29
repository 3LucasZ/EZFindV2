import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

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
    <IconButton
      //color
      bg={mode == 1 ? "green.300" : "red.300"}
      _hover={{ bg: mode == 1 ? "green.400" : "red.400" }}
      color="white"
      aria-label={mode == 1 ? "add" : "delete"}
      //display
      icon={mode == 1 ? <SmallAddIcon /> : <SmallCloseIcon />}
      h={8}
      w={"40px"}
      display={mode == 0 ? "none" : ""}
      //misc
      borderRadius="md"
      roundedLeft="none"
      onClick={mode == 1 ? handleAdd : handleRemove}
    />
  );
}
