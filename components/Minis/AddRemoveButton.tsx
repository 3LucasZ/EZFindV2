import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

//mode, onClick
export default function AddRemoveButton({ ...props }) {
  return (
    <IconButton
      //color
      bg={props.mode == 1 ? "green.300" : "red.300"}
      _hover={{ bg: props.mode == 1 ? "green.400" : "red.400" }}
      color="white"
      aria-label={props.mode == 1 ? "add" : "delete"}
      //display
      icon={props.mode == 1 ? <SmallAddIcon /> : <SmallCloseIcon />}
      h={8}
      w={"40px"}
      display={props.mode == 0 ? "none" : ""}
      //misc
      borderRadius="md"
      roundedLeft="none"
      onClick={props.onClick}
    />
  );
}
