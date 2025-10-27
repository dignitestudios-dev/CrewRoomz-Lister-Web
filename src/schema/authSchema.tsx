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
    .matches(
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format."
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Domain cannot start with dot or hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !/^[.-]/.test(domain) : false;
      }
    ),

  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain atleast 6 alphanumeric characters.")
    .required("Please enter your password"),
});

export const signUpSchema = Yup.object({
  profile: Yup.mixed<File>()
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
    .matches(
      /^[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format."
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Email cannot start domain with dot or hyphen.",
      (value) => (value ? !/@[.-]/.test(value) : false)
    )
    .test(
      "no-hyphen-start-domain",
      "Domain cannot start with hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !domain.startsWith("-") : false;
      }
    ),

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

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match"),

  isChecked: Yup.boolean().oneOf(
    [true],
    "You must accept Terms & Conditions before signing up"
  ),
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
    .matches(
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
      "Invalid email format."
    )
    .test("no-dot-before-at", "Email cannot have a dot before @.", (value) =>
      value ? !/\.@/.test(value) : false
    )
    .test(
      "no-dot-or-hyphen-after-at",
      "Domain cannot start with dot or hyphen.",
      (value) => {
        const domain = value?.split("@")[1];
        return domain ? !/^[.-]/.test(domain) : false;
      }
    ),
});

export const resetPasswordSchema = Yup.object({
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

  cPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match"),
});

export const verifSchema = Yup.object({
  facePic: Yup.mixed<File>()
    .required("Face picture is required")
    .test("fileSize", "File size too large (max 2MB)", (value) => {
      return value ? value.size <= 2 * 1024 * 1024 : false;
    })
    .test("fileType", "Only JPG/PNG files are allowed", (value) => {
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    }),
  idFront: Yup.mixed<File>()
    .required("ID front picture is required")
    .test("fileSize", "File size too large (max 2MB)", (value) => {
      return value ? value.size <= 2 * 1024 * 1024 : false;
    })
    .test("fileType", "Only JPG/PNG files are allowed", (value) => {
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    }),
  idBack: Yup.mixed<File>()
    .required("ID back picture is required")
    .test("fileSize", "File size too large (max 2MB)", (value) => {
      return value ? value.size <= 2 * 1024 * 1024 : false;
    })
    .test("fileType", "Only JPG/PNG files are allowed", (value) => {
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    }),
});
