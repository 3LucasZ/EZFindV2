import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { signIn, signOut, useSession } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";
import { debugMode } from "services/constants";

type HeaderProps = {
  isAdmin: boolean;
};
export default function Header({ isAdmin }: HeaderProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const loginUI = (
    <Stack>
      <Text>{session ? session.user!.email : "You are not signed in"}</Text>
      <Flex>
        <IconButton
          isLoading={loading}
          colorScheme="teal"
          variant="solid"
          onClick={(e) => {
            if (debugMode) console.log(e);
            e.preventDefault();
            setLoading(true);
            session
              ? signOut({ callbackUrl: "/" })
              : signIn("google", { callbackUrl: "/" });
          }}
          aria-label={session ? "Sign out" : "Sign in"}
          icon={<Icon as={session ? PiSignOutBold : PiSignInBold} />}
        />
        {isAdmin && (
          <>
            <Box w="2"></Box>
            <IconButton
              colorScheme="teal"
              onClick={() => {
                Router.push("/manage-admin");
              }}
              aria-label="Admin Dashboard"
              icon={<Icon as={RiAdminLine} />}
            />
          </>
        )}
      </Flex>
    </Stack>
  );
  return (
    <HStack spacing={10} pb={5} pt={1}>
      <Box w={"33%"}></Box>
      <Box w={"33%"}>
        <Center>
          <Link href={"/"} style={{ textDecoration: "none" }}>
            <Heading size={["xl", "2xl", "3xl"]} color="teal.500">
              EZCheck
            </Heading>
          </Link>
        </Center>
      </Box>
      <Box>{loginUI}</Box>
    </HStack>
  );
}
