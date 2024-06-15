// import { Box, GridItem, Link, Text } from "@chakra-ui/react";
// import Router from "next/router";

// type BaseWidgetProps = {
//   href?: string;
//   title: string;
//   bg: string;
//   bgHover?: string;
//   colSpan: number;
//   cnt?: number;
// };

// export default function BaseWidget({
//   href,
//   title,
//   bg,
//   colSpan,
//   bgHover,
//   cnt,
// }: BaseWidgetProps) {
//   return (
//     <GridItem
//       //size
//       minH={8}
//       colSpan={colSpan}
//       //color
//       bg={bg}
//       color="white"
//       _hover={{ bg: bgHover }}
//       //position
//       display={"flex"}
//       flexDir="row"
//       alignItems={"center"}
//     >
//       <Box
//         //size
//         w="100%"
//         px={4}
//         //misc
//         onClick={() => Router.push(href ? href : "")}
//         style={{ textDecoration: "none" }}
//         sx={{
//           WebkitUserDrag: "none",
//         }}
//       >
//         <Text noOfLines={1}>{title}</Text>
//       </Box>
//       {cnt && (
//         <Box
//           //size
//           h="100%"
//           minW="60px"
//           //color
//           bg="orange.200"
//           //position
//           display="flex"
//           flexDir="row"
//           alignItems={"center"}
//           justifyContent={"center"}
//         >
//           {cnt == -1 ? 0 : cnt}
//         </Box>
//       )}
//     </GridItem>
//   );
// }
