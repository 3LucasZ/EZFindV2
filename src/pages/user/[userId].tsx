import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { UserProps } from "types/db";

type PageProps = {
  user: UserProps;
};

export default function UserPage({ user }: PageProps) {
  return "PLACEHOLDER PAGE";
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  var user = await prisma.user.findUnique({
    where: {
      id: String(context.params?.userId),
    },
  });

  return {
    props: {
      user,
    },
  };
};
