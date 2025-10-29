import { useNavigate } from "react-router";
import useAuthStore from "../../store/authStore";
import { useToast } from "../../hooks/useToast";
import { useEffect, useReducer, useState } from "react";
import { useFormik } from "formik";
import { verifValues } from "../../init/authValues";
import { verifSchema } from "../../schema/authSchema";
import axios from "../../axios";
import { getErrorMessage } from "../../init/appValues";
import Toast from "../../components/global/Toast";
import AuthButton from "../../components/Auth/AuthButton";
import { HiOutlinePlus } from "react-icons/hi";
import { useAppStore } from "../../store/appStore";

// Define the shape of the state
type FileState = {
  facePic: string | null;
  idFront: string | null;
  idBack: string | null;
};

// Define the shape of the action
type FileAction =
  | { type: "facePic"; payload: File }
  | { type: "idFront"; payload: File }
  | { type: "idBack"; payload: File };

const fileStates: FileState = {
  facePic: null,
  idFront: null,
  idBack: null,
};

const fileReducer = (state: FileState, action: FileAction): FileState => {
  switch (action.type) {
    case "facePic":
      return { ...state, facePic: URL.createObjectURL(action.payload) };
    case "idFront":
      return { ...state, idFront: URL.createObjectURL(action.payload) };
    case "idBack":
      return { ...state, idBack: URL.createObjectURL(action.payload) };
    default:
      return state;
  }
};

const Verif = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { user } = useAppStore();

  const { toast, showToast } = useToast();
  const [CompState, setCompState] = useState<LoadState>("idle");
  const [state, dispatch] = useReducer(fileReducer, fileStates);

  const { handleSubmit, setFieldValue, errors, touched } = useFormik({
    initialValues: verifValues,
    validationSchema: verifSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setCompState("loading");
      const formData = new FormData();
      formData.append("front", values.idFront);
      formData.append("back", values.idBack);
      formData.append("face", values.facePic);

      try {
        const response = await axios.post("/user/verifyIdentity", formData);
        if (response.status === 200) {
          const data = response?.data?.data;
          setAuth(data.token, data.user, true);
          setCompState("ready");
          const message =
            typeof response?.data?.message === "string"
              ? response.data.message.toUpperCase()
              : "SUCCESS";
          showToast(message, "success");
          if (toast?.visible === false) {
            navigate("/home");
          }
        }
      } catch (error) {
        setCompState("error");
        showToast(getErrorMessage(error), "error");
      }
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const filesList = e.currentTarget.files;
    const file = filesList && filesList[0];
    if (file) {
      if (field === "facePic") {
        setFieldValue(field, file);
        dispatch({ type: "facePic", payload: file });
      } else if (field === "idFront") {
        setFieldValue(field, file);
        dispatch({ type: "idFront", payload: file });
      } else if (field === "idBack") {
        setFieldValue(field, file);
        dispatch({ type: "idBack", payload: file });
      }
    }
  };

  useEffect(() => {
    if (user?.identityStatus === "approved") {
      navigate("/home");
    }
  }, [user]);

  return (
    <div className="lg:min-h-screen lg:flex p-8 lg:p-0">
      {(CompState === "error" || CompState === "ready") && <Toast {...toast} />}
      <div className="w-full p-0 lg:p-4">
        {/* <div className="lg:block hidden">
          <img
            src={signInSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div> */}
        <div className="flex flex-col items-center justify-center w-full lg:p-6">
          <div className="mb-8 text-center space-y-2">
            <p className="text-[24px] font-semibold">Identity Verification</p>
            <p className="text-[14px] text-[#565656]">
              Upload a government-issued ID to verify your identity.
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full lg:max-w-[55%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%]"
            >
              <div className="flex flex-col items-center gap-4">
                <label
                  htmlFor="facePic"
                  className="w-30 h-30 rounded-full border-2 border-dashed border-[#36C0EF] flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {state.facePic ? (
                    <img
                      src={state.facePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-[#36C0EF]">+</span>
                  )}
                  <input
                    id="facePic"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleFileChange(e, "facePic")}
                    className="hidden"
                  />
                </label>
                <label
                  htmlFor="profilePic"
                  className="gradient-text font-medium cursor-pointer"
                >
                  Upload Face Image
                </label>
                {errors?.facePic && touched?.facePic && (
                  <p className="text-red-600 text-[12px]">{errors?.facePic}</p>
                )}
              </div>

              <div className="mt-6 flex justify-center items-center gap-4">
                <div className="border-[2px] h-[180px] w-[280px] border-dashed bg-gray-50 border-[#36C0EF] rounded-lg pt-2 pb-4 px-4 text-center block">
                  <div className="flex justify-start pb-4 ">
                    <p>ID Front Image</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg cursor-pointer h-[120px] w-[250px]">
                    <label
                      htmlFor="idFront"
                      className="rounded-lg p-10 text-center cursor-pointer"
                    >
                      {state.idFront ? (
                        <div className="absolute pl-3">
                          <img
                            src={state.idFront}
                            alt="id_front"
                            className="h-20 rounded-md object-cover "
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <HiOutlinePlus className="text-[#36C0EF] text-3xl text-center" />
                          <p className="text-[#36C0EF] text-[14px]">Upload </p>
                        </div>
                      )}

                      <input
                        type="file"
                        id="idFront"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, "idFront")}
                        className="hidden"
                      />
                    </label>

                    {/* previews */}

                    {touched.idFront && errors.idFront && (
                      <div className="text-red-500 text-sm mt-2">
                        {errors.idFront as string}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-[2px] h-[180px] w-[280px] border-dashed bg-gray-50 border-[#36C0EF] rounded-lg pt-2 pb-4 px-4 text-center block">
                  <div className="flex justify-start pb-4 ">
                    <p>ID Back Image</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg cursor-pointer h-[120px] w-[250px]">
                    <label
                      htmlFor="idBack"
                      className="rounded-lg p-10 text-center cursor-pointer"
                    >
                      {state.idBack ? (
                        <div className="absolute pl-3">
                          <img
                            src={state.idBack}
                            alt="id_front"
                            className="h-20 rounded-md object-cover "
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <HiOutlinePlus className="text-[#36C0EF] text-3xl text-center" />
                          <p className="text-[#36C0EF] text-[14px]">Upload </p>
                        </div>
                      )}

                      <input
                        type="file"
                        id="idBack"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, "idBack")}
                        className="hidden"
                      />
                    </label>

                    {/* previews */}

                    {touched.idBack && errors.idBack && (
                      <div className="text-red-500 text-sm mt-2">
                        {errors.idBack as string}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <AuthButton
                  text="Submit Verification"
                  loading={CompState === "loading" ? true : false}
                  type="submit"
                />
                {/* Skip Button */}
                <button
                  onClick={() => navigate("/home")}
                  type="button"
                  className={`w-full rounded-[8px] text-[16px] px-6 mt-2 font-semibold bg-transparent gradient-text cursor-pointer`}
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verif;
