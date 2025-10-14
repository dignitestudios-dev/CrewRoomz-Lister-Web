import AuthInput from "../Auth/AuthInput";
import { useFormik } from "formik";
import { changPasswordValues, getErrorMessage } from "../../init/appValues";
import { changePasswordSchema } from "../../schema/appSchema";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import axios from "../../axios";
import Toast from "../global/Toast";

const ChangePassword = () => {
  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");

  const { values, handleBlur, handleChange, errors, touched, handleSubmit } =
    useFormik({
      initialValues: changPasswordValues,
      validationSchema: changePasswordSchema,
      onSubmit: async (values) => {
        const payload = {
          currentPassword: values.password,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };

        try {
          setState("loading");
          const response = await axios.post("/user/changePassword", payload);
          if (response.status === 200) {
            setState("ready");
            showToast("Password updated successfully", "success");
          }
        } catch (error) {
          setState("error");
          showToast(getErrorMessage(error), "error");
        }
      },
    });

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col items-center py-8">
      {(state === "error" || state === "ready") && <Toast {...toast} />}
      <p className="text-[#000000] text-[20px] font-semibold py-2">
        Change Password
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 w-[380px]">
          <AuthInput
            label="Current Password"
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
        <p className="text-[14px] text-gray-400 pb-2">
          You must enter current password in order to change password.
        </p>

        <div className="mb-4 w-[380px]">
          <AuthInput
            label="New Password"
            placeholder="Enter password"
            showToggle
            id="newPassword"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.newPassword}
            touched={touched.newPassword}
            maxLength={50}
          />
        </div>

        <div className="mb-4 w-[380px]">
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

        <button
          disabled={state === "loading"}
          type="submit"
          className="w-[384px] my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
        >
          {state === "loading" ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
