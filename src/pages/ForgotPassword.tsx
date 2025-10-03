import { useState } from "react";
import { signupSideImg } from "../assets/export";
import AuthInput from "../components/Auth/AuthInput";
import { useFormik } from "formik";
// import axios from "axios";
import { forgotPasswordSchema } from "../schema/authSchema";
import { forgotPasswordValue } from "../init/authValues";
// import { ErrorToast, SuccessToast } from "../components/global/Toaster";
// import useAuthStore from "../store/authStore";
import AuthButton from "../components/Auth/AuthButton";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const navigate = useNavigate();
  // const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ Login ~ loading:", loading);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: forgotPasswordValue,
      validationSchema: forgotPasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        console.log("🚀 ~ Login ~ values:", values);
        // const payload = {
        //   email: values.email,
        //   password: values.password,
        //   role: "landlord",
        // };
        try {
          navigate("/verify-password-otp");
          // setLoading(true);
          // const response = await axios.post("/auth/emailSignIn", payload);
          // if (response.status === 200) {
          //   const data = response?.data?.data;
          //   SuccessToast("Success");
          //   setAuth(data.token, data.user, true);
          // }
        } catch (error) {
          console.log("🚀 ~ Login ~ error:", error);
          // ErrorToast(error.response.data.message);
          // navigate("/auth/signup-otp", { state: { email: values.email } });
        } finally {
          setLoading(false);
        }
      },
    });
  console.log("🚀 ~ ForgotPassword ~ errors:", errors);

  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
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
                <AuthButton text="Send OTP" loading={loading} type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
