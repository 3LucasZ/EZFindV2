import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "./constants";
import { GroupProps } from "components/Widget/GroupWidget";
import { User } from "next-auth";

export function getIPFromReq(req: NextApiRequest) {
  console.log("headers", req.headers);
  console.log("socket.remoteAddress", req.socket.remoteAddress);
  var ip: string =
    (req.headers["x-real-ip"] as string) || req.socket.remoteAddress || "err";
  if (ip?.substring(0, 7) == "::ffff:") {
    ip = ip.substring(7);
  }
  if (debugMode) console.log("IP:", ip);
  return ip;
}

export function getPerms(user: User | undefined, group: GroupProps) {
  const isAdmin = user ? user.isAdmin : false;
  const relation = group.userRelations?.find((x) => x.userId == user?.id);
  const pagePerm = isAdmin
    ? 2
    : Math.max(group.minPerm, relation?.perm ? relation.perm : -1);
  return { isAdmin, pagePerm };
}
