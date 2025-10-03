import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  images: Yup.mixed().required("Please upload at least one image"),

  sharedBath: Yup.number()
    .typeError("Value must be a number")
    .required("Required"),
  privateBath: Yup.number()
    .typeError("Value must be a number")
    .required("Required"),
});

export const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain at least 6 characters")
    .required("Please enter your password"),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),

  newPassword: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain at least 6 characters")
    .required("Please enter your password"),
});
