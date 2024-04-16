import { UserProps } from "components/Widget/UserWidget";
import { Session } from "next-auth";

export function checkAdmin(
  session: Session | null,
  admins: UserProps[]
): boolean {
  return (
    (session &&
      session.user &&
      session.user.email &&
      (admins.map((admin) => admin.email).includes(session.user.email) ||
        session.user.email == "lucas.j.zheng@gmail.com" ||
        session.user.email == "lucas.zheng@warriorlife.net")) == true
  );
}
