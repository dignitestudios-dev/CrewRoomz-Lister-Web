import * as Yup from "yup";

export const signInSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .test("no-leading-space", "Email cannot start with a space.", (value) =>
      value ? value[0] !== " " : false
    )
    .test(
      "no-internal-or-trailing-space",
      "Email cannot contain spaces.",
      (value) => (value ? value.trim() === value && !/\s/.test(value) : false)
    )
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format."),

  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain atleast 6 alphanumeric characters.")
    .required("Please enter your password"),
});

export const signUpSchema = Yup.object({
  profile: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "File size too large (max 2MB)", (value) => {
      return value ? value.size <= 2 * 1024 * 1024 : false;
    })
    .test("fileType", "Only JPG/PNG files are allowed", (value) => {
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    }),

  fullName: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .min(3, "Full name must be at least 3 characters long"),

  email: Yup.string()
    .required("Email is required")
    .test("no-leading-space", "Email cannot start with a space.", (value) =>
      value ? value[0] !== " " : false
    )
    .test(
      "no-internal-or-trailing-space",
      "Email cannot contain spaces.",
      (value) => (value ? value.trim() === value && !/\s/.test(value) : false)
    )
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format."),

  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain at least 6 characters")
    .required("Please enter your password"),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .test("no-leading-space", "Email cannot start with a space.", (value) =>
      value ? value[0] !== " " : false
    )
    .test(
      "no-internal-or-trailing-space",
      "Email cannot contain spaces.",
      (value) => (value ? value.trim() === value && !/\s/.test(value) : false)
    )
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format."),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain at least 6 characters")
    .required("Please enter your password"),
  cPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
