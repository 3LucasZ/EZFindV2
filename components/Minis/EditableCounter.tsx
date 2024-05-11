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
    <Box
      // bg="orange.200"
      w="60px"
    >
      <Input
        value={count}
        onChange={onChange}
        isDisabled={isDisabled}
        type="tel"
        // color="white"
        color="black"
        // h={8}
        textAlign={"center"}
        // _disabled={{ color: "white", border: "none" }}
        _disabled={{ color: "black", border: "none" }}
        sx={{ opacity: "1" }}
        rounded="none"
        maxLength={5} //99999
        p={0}
        w={"60px"}
        {...props}
      />
    </Box>
  );
}
