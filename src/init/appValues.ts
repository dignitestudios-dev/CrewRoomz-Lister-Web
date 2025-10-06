export const propertyValues: FormValues = {
  images: null,
  description: "",
  rulesFiles: null,

  sharedBath: "0",
  privateBath: "0",
  address: "123 Bay Street, Downtown Toronto, ON M5J 2X8, Canada",
  amenities: [],
};

export const changPasswordValues = {
  password: "",
  confirmPassword: "",
  newPassword: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong";
}
