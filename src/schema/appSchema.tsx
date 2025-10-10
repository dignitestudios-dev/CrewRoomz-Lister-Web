import * as Yup from "yup";

export const addPropertySchema = Yup.object().shape({
  images: Yup.mixed().required("Please upload at least one image"),
  rulesFiles: Yup.mixed().required("Please upload at least one rule file"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  amenities: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one amenity")
    .required("Amenities are required"),

  sharedBath: Yup.number()
    .typeError("Shared Bath must be a number")
    .integer("Shared Bath must be an integer")
    .min(0, "Shared Bath cannot be negative")
    .required("Shared Bath is required"),

  privateBath: Yup.number()
    .typeError("Private Bath must be a number")
    .integer("Private Bath must be an integer")
    .min(0, "Private Bath cannot be negative")
    .required("Private Bath is required"),

  // address: Yup.string()
  //   .trim()
  //   .required("Address is required")
  //   .min(5, "Address must be at least 5 characters long"),
});

export const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain at least 6 characters")
    .required("Please enter your password"),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  newPassword: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain at least 6 characters")
    .required("Please enter your password"),
});
