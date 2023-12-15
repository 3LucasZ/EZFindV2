import { AdminProps } from "components/Widget/AdminWidget2";
import { Session } from "next-auth";

export function checkAdmin(
  session: Session | null,
  admins: AdminProps[]
): boolean {
  return (
    (session &&
      session.user &&
      session.user.email &&
      (admins.map((admin) => admin.email).includes(session.user.email) ||
        session.user.email == "lucas.j.zheng@gmail.com")) == true
  );
}
