import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlinePlus } from "react-icons/hi";
import { useNavigate } from "react-router";
import { binIcon, map, pdfIcon, ticked, untick } from "../../assets/export";
import { useReducer, useState } from "react";
import { AMENITY_GROUPS } from "../../statics/amenities";
import { validationSchema } from "../../schema/appSchema";
import { useFormik } from "formik";
import { propertyValues } from "../../init/appValues";
import { RxCross2 } from "react-icons/rx";

type Action =
  | { type: "ADD_BED" }
  | { type: "REMOVE_BED"; index: number }
  | { type: "SET_BED_TYPE"; index: number; payload: string }
  | {
      type: "SET_PRICE";
      index: number;
      payload: { name: keyof Prices; value: string };
    }
  | {
      type: "SET_BUNK_PRICE";
      index: number;
      payload: { bunk: BunkType; name: keyof Prices; value: string };
    };

const initialState: State = {
  beds: [
    {
      bedType: "",
      prices: { dailyPrice: "", monthlyPrice: "" },
      bunkPrices: {
        top: { dailyPrice: "", monthlyPrice: "" },
        bottom: { dailyPrice: "", monthlyPrice: "" },
      },
    },
  ],
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "ADD_BED":
      return {
        ...state,
        beds: [
          ...state.beds,
          {
            bedType: "",
            prices: { dailyPrice: "", monthlyPrice: "" },
            bunkPrices: {
              top: { dailyPrice: "", monthlyPrice: "" },
              bottom: { dailyPrice: "", monthlyPrice: "" },
            },
          },
        ],
      };

    case "REMOVE_BED":
      return {
        ...state,
        beds: state.beds.filter((_, i) => i !== action.index),
      };

    case "SET_BED_TYPE":
      return {
        ...state,
        beds: state.beds.map((bed, i) =>
          i === action.index ? { ...bed, bedType: action.payload } : bed
        ),
      };

    case "SET_PRICE":
      return {
        ...state,
        beds: state.beds.map((bed, i) =>
          i === action.index
            ? {
                ...bed,
                prices: {
                  ...bed.prices,
                  [action.payload.name]: action.payload.value,
                },
              }
            : bed
        ),
      };

    case "SET_BUNK_PRICE":
      return {
        ...state,
        beds: state.beds.map((bed, i) =>
          i === action.index
            ? {
                ...bed,
                bunkPrices: {
                  ...bed.bunkPrices,
                  [action.payload.bunk]: {
                    ...bed.bunkPrices[action.payload.bunk],
                    [action.payload.name]: action.payload.value,
                  },
                },
              }
            : bed
        ),
      };

    default:
      return state;
  }
}

const PropertyAdd = () => {
  const navigate = useNavigate();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [rulesPreviews, setRulesPreviews] = useState<string[]>([]);

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("🚀 ~ PropertyAdd ~ state:", state);

  const handleBedTypeChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch({ type: "SET_BED_TYPE", index, payload: e.target.value });
  };

  const handlePriceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "SET_PRICE",
      index,
      payload: { name: e.target.name as keyof Prices, value: e.target.value },
    });
  };

  const handleBunkPriceChange = (
    index: number,
    bunk: BunkType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "SET_BUNK_PRICE",
      index,
      payload: {
        bunk,
        name: e.target.name as keyof Prices,
        value: e.target.value,
      },
    });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFieldValue("images", files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const handleRulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFieldValue("rulesFiles", files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setRulesPreviews(previews);
  };

  const handleRemoveRules = (index: number) => {
    const preview = rulesPreviews[index];
    if (preview && preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch {
        console.log("Error ~ 37 ~");
      }
    }
    const newPreviews = rulesPreviews.filter((_, i) => i !== index);

    setRulesPreviews(newPreviews);

    const currentFiles: File[] = values.rulesFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);

    setFieldValue("rulesFiles", newFiles);
  };

  const handleRemoveImage = (index: number) => {
    const preview = imagePreviews[index];
    if (preview && preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch {
        console.log("Error ~ 57 ~");
      }
    }

    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    const currentFiles: File[] = values.images || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setFieldValue("image", newFiles);
  };

  const toggleAmenity = (option: string) => {
    const arr = values.amenities || [];
    if (arr.includes(option)) {
      setFieldValue(
        "amenities",
        arr.filter((a) => a !== option)
      );
    } else {
      setFieldValue("amenities", [...arr, option]);
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<FormValues>({
    initialValues: propertyValues,
    validationSchema,
    onSubmit: (values) => {
      // prepare payload
      console.log("Submit values:", values);
      // convert files etc. to FormData if needed before API call
      // navigate or show success
      // navigate("/app/home");
    },
  });

  return (
    <div className="max-w-[1260px] mx-auto pt-10">
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-3">
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeftLong size={16} />
          </button>
          <h1 className="text-[26px] font-[600]">Add Property</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 p-4 space-y-2">
        <div className="border-[2px] border-dashed bg-gray-50 border-[#36C0EF] rounded-lg pt-2 pb-4 px-4 text-center block">
          <div className="flex justify-start pb-4 ">
            <p>Upload photos/videos</p>
          </div>
          <div className="bg-white p-6 rounded-lg cursor-pointer">
            <label
              htmlFor="fileUpload"
              className="rounded-lg p-10 text-center cursor-pointer"
            >
              <div className="flex flex-col items-center gap-2">
                <HiOutlinePlus className="text-[#36C0EF] text-3xl text-center" />
                <p className="text-[#36C0EF] text-[14px]">Upload </p>
              </div>

              <input
                type="file"
                id="fileUpload"
                accept="image/*,video/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>

            {/* previews */}

            {touched.images && errors.images && (
              <div className="text-red-500 text-sm mt-2">
                {errors.images as string}
              </div>
            )}
          </div>
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {imagePreviews.map((src, i) =>
                src.endsWith(".mp4") ? (
                  <video key={i} src={src} className="h-20 rounded-md" />
                ) : (
                  <div className="relative ">
                    <img
                      key={i}
                      src={src}
                      className="h-20 rounded-md object-cover "
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="cursor-pointer"
                    >
                      <RxCross2 className="text-red-500 absolute text-2xl bg-red-50 top-0 right-0 rounded-tr-xl" />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <label className="text-[16px] font-[500]">Description</label>
        <textarea
          className="w-full bg-white rounded-lg p-2 mt-1"
          rows={4}
          placeholder="Write here"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        ></textarea>

        <label className="text-[16px] font-[500]">Rules to live</label>
        <div className="border-[2px] border-dashed bg-[#ffffff] border-[#36C0EF] rounded-xl pt-2 pb-4 px-4 text-center block mb-6">
          <label
            htmlFor="rulesUpload"
            className="rounded-lg p-10 text-center cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <HiOutlinePlus className="text-[#36C0EF] text-3xl text-center" />
              <p className="text-[#36C0EF] text-[14px]">Upload </p>
            </div>

            <input
              type="file"
              id="rulesUpload"
              accept="application/pdf"
              multiple
              onChange={handleRulesChange}
              className="hidden"
            />
          </label>
        </div>

        {rulesPreviews.length > 0 && (
          <div className=" gap-2 overflow-x-auto">
            {rulesPreviews.map((src, i) => (
              <div key={i} className="bg-white rounded-lg py-4 relative my-1">
                <div>
                  <img
                    key={i}
                    src={pdfIcon}
                    className="h-6  px-4 absolute  rounded-md object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveRules(i);
                  }}
                  className="cursor-pointer"
                >
                  <RxCross2 className="text-red-500 absolute text-2xl bg-red-50 top-0 right-0 rounded-md" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="text-[16px] font-[500] border-t-2 border-t-[#E3E3E3] pt-4">
          Bed Details
        </label>
        <div className=" bg-[#ffffff] rounded-lg pt-2 pb-4 px-4 text-center flex flex-col items-start space-y-2">
          <p className="text-[#18181899] text-[14px] font-[400]">
            Choose daily or monthly booking for bed.
          </p>
          <div className="flex flex-col items-start w-full gap-3">
            {state.beds.map((bed, index) => (
              <div key={index} className="relative">
                <div
                  className={`flex items-center gap-3 w-[750px] ${
                    index % 2 !== 0
                      ? "border-t-[1px] border-t-[#E3E3E3] pt-3"
                      : ""
                  }`}
                >
                  <div className="w-[310px] flex flex-col items-start">
                    <label className="block mb-1 text-[13px] font-[500]">
                      Bed Type
                    </label>
                    <select
                      value={bed.bedType}
                      onChange={(e) => handleBedTypeChange(index, e)}
                      className="w-full py-4.5 pl-3 pr-5 text-[14px] text-[#18181899] bg-[#29ABE21F] rounded-md"
                    >
                      <option value="">Select Bed Type</option>
                      <option value="king">King Bed</option>
                      <option value="queen">Queen Bed</option>
                      <option value="bunk">Bunk Bed</option>
                    </select>
                  </div>
                  {state.beds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "REMOVE_BED", index })}
                      className="ml-auto text-red-500 text-sm font-medium hover:underline absolute top-0 right-0"
                    >
                      <img
                        src={binIcon}
                        className="h-7 w-7 p-1 hover:p-1.5 hover:bg-red-100 hover:rounded-4xl"
                      />
                    </button>
                  )}
                  {bed.bedType && bed.bedType !== "bunk" && (
                    <div>
                      <label className="block mb-1 text-[13px] font-[500] text-start">
                        Price
                      </label>
                      <div className="w-[310px] flex items-start gap-2">
                        <div className="w-full py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Daily
                          </label>
                          <input
                            name="dailyPrice"
                            value={bed.prices.dailyPrice}
                            onChange={(e) => handlePriceChange(index, e)}
                            className="w-full bg-transparent"
                            placeholder="e.g. 50"
                          />
                        </div>
                        <div className="w-full py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Monthly
                          </label>
                          <input
                            name="monthlyPrice"
                            value={bed.prices.monthlyPrice}
                            onChange={(e) => handlePriceChange(index, e)}
                            className="w-full bg-transparent"
                            placeholder="e.g. 1000"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {bed.bedType === "bunk" && (
                  <div className="flex flex-col gap-4">
                    {["top", "bottom"].map((bunk) => (
                      <div key={bunk}>
                        <label className="block mb-1 text-[13px] font-[500] text-start">
                          {bunk === "top" ? "Top Bed" : "Bottom Bed"}
                        </label>
                        <div className="w-full flex items-start gap-2">
                          <div className="w-[153px] py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                            <label className="block mb-1 text-[13px] font-[500] text-start">
                              Daily
                            </label>
                            <input
                              name="dailyPrice"
                              value={
                                bed.bunkPrices[bunk as BunkType].dailyPrice
                              }
                              onChange={(e) =>
                                handleBunkPriceChange(
                                  index,
                                  bunk as BunkType,
                                  e
                                )
                              }
                              className="w-full bg-transparent text-[16px] text-[#181818]"
                              placeholder="e.g. 50"
                            />
                          </div>
                          <div className="w-[153px] py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                            <label className="block mb-1 text-[13px] font-[500] text-start">
                              Monthly
                            </label>
                            <input
                              name="monthlyPrice"
                              value={
                                bed.bunkPrices[bunk as BunkType].monthlyPrice
                              }
                              onChange={(e) =>
                                handleBunkPriceChange(
                                  index,
                                  bunk as BunkType,
                                  e
                                )
                              }
                              className="w-full bg-transparent text-[16px] text-[#181818]"
                              placeholder="e.g. 1000"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => dispatch({ type: "ADD_BED" })}
              className="flex items-center gap-2 pt-2 cursor-pointer"
            >
              <HiOutlinePlus className="text-[18px] text-[#36C0EF]" />
              <p className="text-[14px] gradient-text font-[500]">
                Add More Bed
              </p>
            </button>
          </div>
        </div>

        <label className="text-[16px] font-[500] pt-4">Bath Details</label>
        <div className=" bg-[#ffffff] rounded-lg pt-2 pb-4 px-4 text-center flex items-center space-y-2 mb-6">
          <div className="w-[310px] flex flex-col items-start mr-4">
            <label className="block mb-1 text-[13px] font-[500]">
              Shared Bath
            </label>
            <input
              name="sharedBath"
              value={values.sharedBath}
              onChange={handleChange}
              className="bg-[#29ABE21F] w-[311px] h-[54px] rounded-md px-4"
            />
            {touched.sharedBath && errors.sharedBath && (
              <div className="text-red-500 text-sm mt-1">
                {errors.sharedBath}
              </div>
            )}
          </div>
          <div className="w-[310px] flex flex-col items-start mr-4 ">
            <label className="block mb-1 text-[13px] font-[500]">
              Private Bath
            </label>
            <input
              name="privateBath"
              value={values.privateBath}
              onChange={handleChange}
              className="bg-[#29ABE21F] w-[311px] h-[54px] rounded-md px-4"
            />
            {touched.privateBath && errors.privateBath && (
              <div className="text-red-500 text-sm mt-1">
                {errors.privateBath}
              </div>
            )}
          </div>
        </div>

        <label className="text-[16px] font-[500] border-t-2 border-t-[#E3E3E3] pt-4">
          Address
        </label>
        <div className=" h-[100px] bg-[#ffffff] rounded-lg pt-2 pb-4 px-4 text-center flex flex-col items-start space-y-2">
          <input
            name="address"
            value={values.address}
            onChange={handleChange}
            className="w-full bg-transparent"
          />
        </div>
        <div className=" mb-6">
          <img src={map} className="h-[170px] w-full" />
        </div>

        <div className=" pt-4 border-t-2 border-t-[#E3E3E3]">
          <p className="text-[20px] font-semibold">Amenities</p>
          <p className="text-[#18181899] text-[14px] font-[400]">
            You can select multiple options for amenities:
          </p>
          {AMENITY_GROUPS.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="text-[16px] font-[500] py-3">{group.title}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {group.items.map((item, index) => {
                  const isChecked = values.amenities.includes(item);

                  return (
                    <div key={index} className="flex items-center gap-2 py-1">
                      <label className="flex items-center cursor-pointer select-none gap-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAmenity(item)}
                          className="hidden"
                        />
                        <img
                          src={isChecked ? ticked : untick}
                          alt={isChecked ? "Checked" : "Unchecked"}
                          className="w-5 h-5 transition-transform duration-200 ease-in-out"
                        />

                        <span className="text-[14px]">{item}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-end items-center">
          <button
            type="submit"
            className=" rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
          >
            Create Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyAdd;
