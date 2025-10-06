import { useState } from "react";
import { useFormik } from "formik";
import { signupSideImg } from "../../assets/export";
import AuthInput from "../../components/Auth/AuthInput";
import { forgotPasswordSchema } from "../../schema/authSchema";
import { forgotPasswordValue } from "../../init/authValues";
import AuthButton from "../../components/Auth/AuthButton";
import { useNavigate } from "react-router";
import axios from "../../axios";
import { useToast } from "../../components/global/useToast";
import Toast from "../../components/global/Toast";
import { getErrorMessage } from "../../init/appValues";

const ForgotPassword = () => {
  const navigate = useNavigate();
  // const setAuth = useAuthStore((s) => s.setAuth);
  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: forgotPasswordValue,
      validationSchema: forgotPasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        const payload = {
          email: values.email,
          role: "lister",
        };
        try {
          // setLoading(true);
          setState("loading");
          const response = await axios.post("/auth/forgot", payload);
          console.log("🚀 ~ ForgotPassword ~ response:", response);
          if (response.status === 200) {
            //   const data = response?.data?.data;
            setState("ready");
            showToast("Otp Send Successfully", "success");

            if (toast?.visible === false) {
              navigate("/verify-password-otp", {
                state: { email: values.email },
              });
            }
            //   setAuth(data.token, data.user, true);
          }
        } catch (error) {
          console.log("🚀 ~ Login ~ error:", error);
          setState("error");
          showToast(getErrorMessage(error), "error");
        }
      },
    });

  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
      {(state === "error" || state === "ready") && <Toast {...toast} />}
      <div className="grid lg:grid-cols-2 grid-cols-1 p-0 lg:p-4">
        <div className="lg:block hidden">
          <img
            src={signupSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div>
        <div className="flex flex-col items-center justify-center lg:p-6">
          <div className="mb-8 text-center space-y-2 lg:max-w-[55%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%] ">
            <p className="text-[24px] font-semibold">Forgot Password</p>
            <p className="text-[14px] text-[#565656]">
              Enter your email below, and we will send you a verification code
              to reset your password securely.
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

              <div className="mt-6">
                <AuthButton
                  text="Send OTP"
                  loading={state === "loading" ? true : false}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
