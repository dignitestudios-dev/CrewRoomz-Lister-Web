import { useState } from "react";
import { checked, signInSideImg, unchecked } from "../../assets/export";
import AuthInput from "../../components/Auth/AuthInput";
import { useFormik } from "formik";
import { signUpSchema } from "../../schema/authSchema";
import { signUpValues } from "../../init/authValues";
import { NavLink, useNavigate } from "react-router";
import AuthButton from "../../components/Auth/AuthButton";
import SocialLogin from "../../components/Auth/SocialLogin";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/global/Toast";
import { getErrorMessage } from "../../init/appValues";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";

interface SignUpValues {
  fullName: string;
  email: string;
  password: string;
  profile?: File; // optional image upload
}

const SignUp = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");

  const [files, setFiles] = useState<{ profilePreview: string | null }>({
    profilePreview: null,
  });

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues: signUpValues,
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        setState("loading");
        const newUser = await createUserWithEmailAndPassword(
          auth,
          values.email.toLocaleLowerCase(),
          values.email.toLocaleLowerCase()
        );
        console.log("newUser --- > ", newUser);
        const token = await getIdToken(newUser.user);
        if (token) {
          handelSignUp(values as SignUpValues, token);
        }
      } catch (error) {
        if (
          (error as { message?: string })?.message?.includes(
            "auth/email-already-in-use"
          )
        ) {
          // Try to sign in the
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              values.email.toLocaleLowerCase(),
              values.email.toLocaleLowerCase()
            );
            const user = userCredential?.user;
            //   // Get the ID token
            const token = await getIdToken(user);
            if (token) {
              handelSignUp(values as SignUpValues, token);
            } else {
              // ErrorToast("Token Not Found");
              setState("ready");
            }
          } catch (err) {
            console.log("🚀 ~ ~ firebase Two is ~ err:", err);
            // ErrorToast("Email is already in use");
            // setLoading(false);
            setState("error");
          }
        }
      }
    },
  });

  const handelSignUp = async (values: SignUpValues, idToken: string) => {
    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("name", values.fullName);
    formData.append("idToken", idToken);
    formData.append("role", "lister");
    formData.append("password", values.password);

    if (values.profile) {
      formData.append("profilePicture", values.profile);
    }
    try {
      const response = await axios.post("/auth/signUp", formData);
      if (response.status === 201 || response.status === 200) {
        setState("ready");
        showToast("Login Success", "success");
        navigate("/verify-login-otp", { state: { email: values?.email } });
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  // File handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.currentTarget.files;
    const file = filesList && filesList[0];

    if (file) {
      setFieldValue("profile", file);
      setFiles((prev) => ({
        ...prev,
        profilePreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
      {(state === "error" || state === "ready") && <Toast {...toast} />}
      <div className="grid lg:grid-cols-2 grid-cols-1 p-0 lg:p-4">
        <div className="lg:block hidden">
          <img
            src={signInSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div>
        <div className="flex flex-col items-center justify-center lg:p-6">
          <div className="mb-8 text-center space-y-2">
            <p className="text-[24px] font-semibold">Signup</p>
            <p className="text-[14px] text-[#565656]">
              Please enter the details below to signup
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full lg:max-w-[55%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%]"
            >
              <div className="flex flex-col items-center gap-4">
                <label
                  htmlFor="profilePic"
                  className="w-20 h-20 rounded-full border-2 border-dashed border-[#36C0EF] flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {files.profilePreview ? (
                    <img
                      src={files.profilePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-[#36C0EF]">+</span>
                  )}
                  <input
                    id="profilePic"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <label
                  htmlFor="profilePic"
                  className="gradient-text font-medium cursor-pointer"
                >
                  Upload Profile Picture
                </label>
                {errors?.profile && touched?.profile && (
                  <p className="text-red-600 text-[12px]">{errors?.profile}</p>
                )}
              </div>
              <div className="mb-4">
                <AuthInput
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  id="fullName"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.fullName}
                  touched={touched.fullName}
                />
              </div>

              <div className="relative">
                <AuthInput
                  label="Email"
                  type="email"
                  placeholder="Enter email here"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  maxLength={50}
                />
              </div>
              <div className="mb-4">
                <AuthInput
                  label="Password"
                  placeholder="Enter password here"
                  showToggle
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  maxLength={50}
                />
              </div>
              <div className="mb-4">
                <AuthInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  showToggle
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  maxLength={50}
                />
              </div>

              <div className="flex items-start gap-3 mt-4">
                <div
                  className="flex items-center cursor-pointer select-none"
                  onClick={() => setFieldValue("isChecked", !values.isChecked)}
                >
                  <input
                    type="checkbox"
                    name="isChecked"
                    checked={values.isChecked}
                    onChange={() =>
                      setFieldValue("isChecked", !values.isChecked)
                    }
                    className="hidden"
                  />
                  <img
                    src={values.isChecked ? checked : unchecked}
                    alt={values.isChecked ? "Checked" : "Unchecked"}
                    className="w-5 h-5 transition-transform duration-200 ease-in-out"
                  />
                </div>

                <div className="ml-1 text-[15px] text-[#18181899]">
                  I accept the{" "}
                  <span
                    className="gradient-text cursor-pointer"
                    onClick={() => console.log("Open Terms & Conditions")}
                  >
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span
                    className="gradient-text cursor-pointer"
                    onClick={() => console.log("Open Privacy Policy")}
                  >
                    Privacy Policy
                  </span>
                </div>
              </div>
              {errors.isChecked && touched.isChecked && (
                <p className="text-red-500 text-[13px] mt-1">
                  {errors.isChecked}
                </p>
              )}
              <div className="mt-6">
                <AuthButton
                  text="Sign Up"
                  loading={state === "loading" ? true : false}
                  type="submit"
                />
              </div>
            </form>
          </div>

          <SocialLogin />
          <p className="text-center text-[16px] text-sm">
            Already have an account?{" "}
            <button
              type="button"
              className="gradient-text font-semibold hover:underline"
            >
              <NavLink to={"/login"}>Login Now</NavLink>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
