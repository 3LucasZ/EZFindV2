export function successToast(toaster: any, desc: string) {
  return toaster({
    title: "Success",
    description: desc,
    status: "success",
    duration: 500,
    isClosable: true,
  });
}

export function errorToast(toaster: any, desc: string) {
  return toaster({
    title: "Error",
    description: desc,
    status: "error",
    duration: 2500,
    isClosable: true,
  });
}
