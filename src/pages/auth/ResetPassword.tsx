import { useState } from "react";
import { signInSideImg } from "../../assets/export";
import AuthInput from "../../components/Auth/AuthInput";
import { useFormik } from "formik";
// import axios from "axios";
import { resetPasswordSchema } from "../../schema/authSchema";
import { resetValue } from "../../init/authValues";
// import { ErrorToast, SuccessToast } from "../components/global/Toaster";
// import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router";
import AuthButton from "../../components/Auth/AuthButton";
import { CiCircleCheck } from "react-icons/ci";

const ResetPassword = () => {
  const navigate = useNavigate();

  // const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ Login ~ loading:", loading);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: resetValue,
      validationSchema: resetPasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        console.log("🚀 ~ Login ~ values:", values);
        setUpdatedSuccess(true);
        // const payload = {
        //   email: values.email,
        //   password: values.password,
        //   role: "landlord",
        // };
        try {
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

  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
      <div className="grid lg:grid-cols-2 grid-cols-1 p-0 lg:p-4">
        <div className="lg:block hidden">
          <img
            src={signInSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div>
        {updatedSuccess ? (
          <div
            onClick={() => navigate("/login")}
            className="flex flex-col items-center justify-center lg:p-6 h-[800px]"
          >
            {/* <LuLoaderCircle className="animate-spin text-[#36C0EF] w-24 h-24 mb-6" /> */}
            <div className="py-2">
              <CiCircleCheck className="text-[120px] text-[#36C0EF]" />
            </div>
            <div className="mb-8 text-center space-y-2">
              <p className="text-[24px] font-semibold">Password Updated!</p>
              <p className="text-[14px] text-[#565656]">
                Your password has been updated successfully.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center lg:p-6 h-[800px]">
            <div className="mb-8 text-center space-y-2">
              <p className="text-[24px] font-semibold">Reset Password</p>
              <p className="text-[14px] text-[#565656]">
                Enter your new password
              </p>
            </div>
            <div className="flex justify-center items-center w-full">
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-6 lg:max-w-[55%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%]"
              >
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
                <div className="relative">
                  <AuthInput
                    label="Confirm Password"
                    placeholder="Enter confirm password here"
                    showToggle
                    id="cPassword"
                    name="cPassword"
                    value={values.cPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.cPassword}
                    touched={touched.cPassword}
                    maxLength={50}
                  />
                </div>

                <div className="mt-6">
                  <AuthButton
                    text="Update Password"
                    loading={loading}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
