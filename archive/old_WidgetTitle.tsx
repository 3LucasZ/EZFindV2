import { Box, GridItem, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

//_hover, bg, onClick, title
export default function WidgetTitle({ ...props }) {
  return (
    <Box
      //in
      px={4}
      display={"flex"}
      //color
      color="white"
      _hover={props._hover}
      bg={props.bg}
      //size
      w={"100%"}
      h={"100%"}
      //misc
      onClick={props.onClick}
      sx={{
        WebkitUserDrag: "none",
      }}
      style={{ textDecoration: "none" }}
      alignItems={"center"}
    >
      <Text noOfLines={1}>{props.title}</Text>
    </Box>
  );
}
