import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import Layout from "components/Layout";

export default function Custom404() {
  return (
    <Layout isAdmin={false}>
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
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={"gray.500"} mb={6}>
          The page you&apos;re looking for does not seem to exist
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
    </Layout>
  );
}
