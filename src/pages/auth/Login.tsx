import { useState } from "react";
import { signInSideImg } from "../../assets/export";
import AuthInput from "../../components/Auth/AuthInput";
import { useFormik } from "formik";
// import axios from "axios";
import { signInSchema } from "../../schema/authSchema";
import { signInValues } from "../../init/authValues";
// import { ErrorToast, SuccessToast } from "../components/global/Toaster";
import useAuthStore from "../../store/authStore";
import { NavLink, useNavigate } from "react-router";
import AuthButton from "../../components/Auth/AuthButton";
import SocialLogin from "../../components/Auth/SocialLogin";
import axios from "../../axios";
import { useToast } from "../../components/global/useToast";
import Toast from "../../components/global/Toast";
import { getErrorMessage } from "../../init/appValues";

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: signInValues,
      validationSchema: signInSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        console.log("🚀 ~ Login ~ values:", values);
        setState("loading");
        const payload = {
          email: values.email,
          password: values.password,
          role: "lister",
        };
        try {
          const response = await axios.post("/auth/signIn", payload);
          if (response.status === 200) {
            const data = response?.data?.data;
            console.log("🚀 ~ Login ~ data:", data);
            navigate("/home");
            // SuccessToast("Success");
            setAuth(data.token, data.user, true);
            setState("ready");

            showToast("Login Success", "success");
          }
        } catch (error) {
          console.log("🚀 ~ Login ~ error:", error);
          setState("error");
          showToast(getErrorMessage(error), "error");
        }
      },
    });

  return (
    <div className="lg:min-h-screen lg:flex p-8 lg:p-0">
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
            <p className="text-[24px] font-semibold">Welcome back!</p>
            <p className="text-[14px] text-[#565656]">
              Please enter your details to login
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full lg:max-w-[55%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%]"
            >
              <div className="mb-4">
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

              <div className="relative">
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
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="text-sm gradient-text hover:underline text-[14px]"
                >
                  <NavLink to={"/forgot-password"}>Forgot Password?</NavLink>
                </button>
              </div>
              <div className="mt-6">
                <AuthButton
                  text="Login"
                  loading={state === "loading" ? true : false}
                  type="submit"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center w-[55%] mt-5">
            <hr className="w-full border-t border-[#898A8D]" />
            <p className="px-2 text-[#181818] text-[14px]">OR</p>
            <hr className="w-full border-t border-[#898A8D]" />
          </div>
          <SocialLogin />
          <p className="text-center text-[16px] text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              className="gradient-text font-semibold hover:underline"
            >
              <NavLink to={"/signup"}>Create now</NavLink>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
