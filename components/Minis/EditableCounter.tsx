import { Box, Input } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

type EditableCounterProps = {
  count: number;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  isDisabled: boolean;
};
export default function EditableCounter({
  count,
  onChange,
  isDisabled,
  ...props
}: EditableCounterProps) {
  return (
    <Input
      //state
      value={count}
      onClick={(e) => e.stopPropagation()}
      onChange={onChange}
      isDisabled={isDisabled}
      //---color
      // color="white"
      color="black"
      bg="white"
      _disabled={{ border: "none", bg: "none" }}
      sx={{ opacity: "1" }} //override default opacity
      //---size and spacing
      maxLength={5} //99999
      p={0}
      minW={"60px"}
      maxW={"60px"}
      textAlign={"center"}
      //---border
      borderRadius="xl"
      //---misc
      transition="none"
      type="tel"
      {...props}
    />
  );
}
