import type { NextApiRequest, NextApiResponse } from "next";
import { GroupProps } from "@/db";
import { User } from "next-auth";
import { UserGroupRelationProps } from "@/db";

export function getIPFromReq(req: NextApiRequest) {
  console.log("headers", req.headers);
  console.log("socket.remoteAddress", req.socket.remoteAddress);
  var ip: string =
    (req.headers["x-real-ip"] as string) || req.socket.remoteAddress || "err";
  if (ip?.substring(0, 7) == "::ffff:") {
    ip = ip.substring(7);
  }
  // console.log("IP:", ip);
  return ip;
}

export function getGroupPerm(user: User | undefined, group: GroupProps) {
  const isAdmin = user ? user.isAdmin : false;
  const relation = user?.groupRelations?.find(
    (groupRelation) => groupRelation.groupId == group.id
  );
  // console.log("isAdmin", isAdmin);
  // console.log("minPerm", group.minPerm);
  const groupPerm = isAdmin
    ? 2
    : Math.max(group.minPerm, relation?.perm ? relation.perm : -1);

  return groupPerm;
}
