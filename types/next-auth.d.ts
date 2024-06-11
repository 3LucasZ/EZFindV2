import NextAuth, { DefaultSession } from "next-auth";
import { UserGroupRelationProps } from "./db";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      //basic
      id: string;
      name: string;
      email: string;
      image: string;
      //custom
      isAdmin: boolean;
      groupRelations: UserGroupRelationProps[];
    } & DefaultSession["user"];
  }
  interface User {
    //basic
    id: string;
    name: string;
    email: string;
    image: string;
    //custom
    isAdmin: boolean;
    groupRelations: UserGroupRelationProps[];
  }
}
