import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import RedirectPage from "components/Main/RedirectPage";
import { useSession } from "next-auth/react";

export default function Custom404() {
  const { data: session, status, update } = useSession();
  return (
    <Layout isAdmin={session?.user.isAdmin}>
      <RedirectPage />
    </Layout>
  );
}
