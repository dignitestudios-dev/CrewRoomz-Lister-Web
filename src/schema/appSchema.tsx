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
    .required("Please enter your password")
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must contain at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character"
    ),

  newPassword: Yup.string()
    .required("Please enter your password")
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must contain at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Password does not match"),
});
