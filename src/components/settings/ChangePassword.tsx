import AuthInput from "../Auth/AuthInput";
import { useFormik } from "formik";
import { changPasswordValues } from "../../init/appValues";
import { changePasswordSchema } from "../../schema/appSchema";

const ChangePassword = () => {
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues: changPasswordValues,
    validationSchema: changePasswordSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col items-center py-8">
      <p className="text-[#000000] text-[20px] font-semibold py-2">
        Change Password
      </p>

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
        type="button"
        className="w-[384px] my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
      >
        Update
      </button>
    </div>
  );
};

export default ChangePassword;
