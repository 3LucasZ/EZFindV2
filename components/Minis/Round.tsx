import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Round({ ...props }) {
  return (
    <Box
      maxW="100%"
      color="white"
      flexDir="row"
      alignItems={"center"}
      display="flex"
      overflow="hidden"
      rounded="md"
      {...props}
    >
      {props.children}
    </Box>
  );
}
