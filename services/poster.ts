import Router from "next/router";
import { errorToast, successToast } from "./toasty";

export async function poster(
  path: string,
  body: any,
  toaster: any,
  external?: boolean
): Promise<Response> {
  try {
    const res = await fetch(external ? path : Router.basePath + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status != 200) {
      errorToast(toaster, "" + (await res.json()));
    } else {
      successToast(toaster, "Success!");
    }
    return res;
  } catch (error) {
    errorToast(toaster, "Unknown error: " + error);
    return new Response();
  }
}
