import { NextApiRequest } from "next";

export interface TypedRequestBody<T> extends NextApiRequest {
  body: T;
}
