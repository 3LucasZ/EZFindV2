import {
  Box,
  Button,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Router from "next/router";
import { animatedGradient } from "services/constants";

type PageProps = {
  errorCode?: string;
  msg1?: string;
  msg2?: string;
};
export default function RedirectPage({ errorCode, msg1, msg2 }: PageProps) {
  return (
    <>
      <Box
        textAlign="center"
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={4}
      >
        <Heading
          display="inline-block"
          as="h1"
          fontSize="120px"
          // bgGradient="linear(to-r, teal.400, teal.600)"
          // bgGradient="linear(to-br,teal.300, blue.300)"
          sx={animatedGradient("teal.300", "blue.400")}
          // bg="cyan.400"
          backgroundClip="text"
        >
          {errorCode ? errorCode : 404}
        </Heading>
        <Text fontSize="4xl" mt={3} mb={2}>
          {msg1 ? msg1 : "Page Not Found"}
        </Text>
        <Text fontSize="xl" color={"gray.500"} mb={6}>
          {msg2 ? msg2 : "The page you are looking for does not seem to exist"}
        </Text>

        <Button
          colorScheme="blue"
          // bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          onClick={() => {
            Router.push("/");
          }}
        >
          Go Home
        </Button>
      </Box>
      <L left={true} top={true} />
      {/* <L left={true} top={false} /> */}
      {/* <L left={false} top={true} /> */}
      <L left={false} top={false} />
    </>
  );
}
type LProps = {
  left: boolean;
  top: boolean;
};
function L(props: LProps) {
  const borderWidth = 0;
  const horLen = useBreakpointValue([100, 150, 200, 250, 300]) || 100;
  const vertLen = 200;
  const depth = 25;
  const spacing = useBreakpointValue([10, 20, 30, 40, 50]) || 10;
  let rotation = 0;
  if (props.left && props.top) {
    rotation = 180;
  } else if (props.left && !props.top) {
    rotation = 90;
  } else if (!props.left && props.top) {
    rotation = 270;
  }
  return (
    <Box
      //border
      borderWidth={`${borderWidth}px`}
      borderStyle="solid"
      borderColor="black"
      //size
      w={horLen + "px"}
      h={vertLen + "px"}
      //position
      pos={"fixed"}
      left={props.left ? spacing + "px" : ""}
      top={props.top ? spacing + "px" : ""}
      right={props.left ? "" : spacing + "px"}
      bottom={props.top ? "" : spacing + "px"}
      //color
      bgGradient={"linear(to-tl, teal.300, blue.400)"}
      //transform
      transform={`rotate(${rotation}deg)`}
    >
      <Box
        //border
        borderWidth={`${borderWidth}px`}
        borderStyle="solid"
        borderColor="black"
        //size
        w={horLen - depth + "px"}
        h={vertLen - depth + "px"}
        //position
        pos="absolute"
        left={`-${borderWidth}px`}
        top={`-${borderWidth}px`}
        //color
        bg="white"
      ></Box>
    </Box>
  );
}
