import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export default function AddRemoveButton({ ...props }) {
  return (
    <IconButton
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
  );
}
