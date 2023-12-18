import { errorToast, successToast } from "./toasty";

export async function poster(path: string, body: any, toaster: any) {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status != 200) {
      errorToast(toaster, "" + (await res.json()));
      return false;
    } else {
      successToast(toaster, "Success!");
      return true;
    }
  } catch (error) {
    errorToast(toaster, "Unknown error: " + error);
    return false;
  }
}
