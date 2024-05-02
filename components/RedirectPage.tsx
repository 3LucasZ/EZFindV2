import { Heading, Button, Box, Text } from "@chakra-ui/react";
import Router from "next/router";

type PageProps = {
  errorCode?: string;
  msg1?: string;
  msg2?: string;
};
export default function RedirectPage({ errorCode, msg1, msg2 }: PageProps) {
  return (
    <>
      <Box h="15%"></Box>
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h1"
          size="4xl"
          // bgGradient="linear(to-r, teal.400, teal.600)"
          bg="teal.400"
          backgroundClip="text"
        >
          {errorCode ? errorCode : 404}
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          {msg1 ? msg1 : "Page Not Found"}
        </Text>
        <Text color={"gray.500"} mb={6}>
          {msg2 ? msg2 : "The page you are looking for does not seem to exist"}
        </Text>

        <Button
          colorScheme="teal"
          // bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          onClick={() => {
            Router.push("/");
          }}
        >
          Go to Home
        </Button>
      </Box>
    </>
  );
}
