import { Box, GridItem, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

//_hover, bg, onClick, title
export default function WidgetTitle({ ...props }) {
  return (
    <Box
      //in
      px={4}
      //color
      color="white"
      _hover={props._hover}
      bg={props.bg}
      //size
      w={"100%"}
      minH={8}
      maxH={8}
      //misc
      onClick={props.onClick}
      sx={{
        WebkitUserDrag: "none",
      }}
      style={{ textDecoration: "none" }}
      alignItems={"center"}
      verticalAlign={"center"}
      alignContent={"center"}
      alignSelf={"center"}
    >
      <Text noOfLines={1}>{props.title}</Text>
    </Box>
  );
}
