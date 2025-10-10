import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlinePlus } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router";
import { pdfIcon, ticked, untick } from "../../assets/export";
import { useReducer, useState } from "react";
import { addPropertySchema } from "../../schema/appSchema";
import { useFormik } from "formik";
import { getErrorMessage, propertyValues } from "../../init/appValues";
import { RxCross2 } from "react-icons/rx";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/global/Toast";
import { bedTypeOptions } from "../../statics/bedOptions";
import GoogleMapComponent from "../../components/global/GoogleMap";
import BedDetails from "../../components/properties/BedDetails";
import { bedReducer, initialState } from "../../init/roomValues";
import AmenitiesSection from "../../components/properties/AmenitiesSection";

interface BedInfo {
  bedType: string;
  prices: {
    dailyPrice: string;
    monthlyPrice: string;
  };
  bunkPrices?: {
    top?: {
      dailyPrice: string;
      monthlyPrice: string;
    };
    bottom?: {
      dailyPrice: string;
      monthlyPrice: string;
    };
  };
}

interface BedDetail {
  type: string;
  price: number;
  monthlyPrice: number;
}

const PropertyAdd = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const type = location.state;

  const [state] = useReducer(bedReducer, initialState);

  const { toast, showToast } = useToast();
  const [componentState, setComponentState] = useState<LoadState>("idle");

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [rulesPreviews, setRulesPreviews] = useState<string[]>([]);

  const [address, setAddress] = useState<Address | null>(null);

  const onLocationSelect = (data: Address) => {
    setAddress(data);
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

  const buildBedDetails = (beds: BedInfo[]): BedDetail[] => {
    const bedDetails: BedDetail[] = [];

    beds.forEach((bed) => {
      if (!["twin", "twin-xl", "full"].includes(bed.bedType)) {
        // Safely destructure with fallback
        const top = bed.bunkPrices?.top || {
          dailyPrice: "0",
          monthlyPrice: "0",
        };
        const bottom = bed.bunkPrices?.bottom || {
          dailyPrice: "0",
          monthlyPrice: "0",
        };

        // Add top bunk
        bedDetails.push({
          type: `${bed.bedType}-top`,
          price: Number(top.dailyPrice),
          monthlyPrice: Number(top.monthlyPrice),
        });

        // Add bottom bunk
        bedDetails.push({
          type: `${bed.bedType}-bottom`,
          price: Number(bottom.dailyPrice),
          monthlyPrice: Number(bottom.monthlyPrice),
        });
      } else {
        bedDetails.push({
          type: bed.bedType,
          price: Number(bed?.prices?.dailyPrice),
          monthlyPrice: Number(bed?.prices?.monthlyPrice),
        });
      }
    });

    return bedDetails;
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
    validationSchema: addPropertySchema,
    onSubmit: async (values) => {
      // prepare payload
      const formData = new FormData();
      if (state.beds[0].bedType?.trim() === "") {
        setComponentState("error");
        showToast(
          getErrorMessage({
            response: { data: { message: "Select bed type and pricing" } },
          }),
          "error"
        );
        return;
      }
      const bedDetails = buildBedDetails(state.beds);
      if (!address) {
        setComponentState("error");
        showToast("Please select an address on the map", "error");
        return;
      }

      formData.append("address", address.address);
      formData.append("city", address.city);
      formData.append("state", address.state);
      // formData.append("country", address.country);
      // formData.append("zipCode", address.zipCode);
      formData.append("location", JSON.stringify(address.location));

      formData.append("description", values.description || "");
      formData.append("sharedBath", values.sharedBath || "0");
      formData.append("privateBath", values.privateBath || "0");
      formData.append("roomType", type === "semi" ? "semi-private" : type);

      // 2️⃣ Amenities (array)
      formData.append("amenities", JSON.stringify(values.amenities || []));

      formData.append("bedDetails", JSON.stringify(bedDetails));

      if (values.images && values.images.length > 0) {
        values.images.forEach((file: File) => {
          formData.append("media", file);
        });
      }

      // 6️⃣ Rules document (single file)
      if (values.rulesFiles && values.rulesFiles.length > 0) {
        formData.append("rulesDocument", values.rulesFiles[0]);
      }

      setComponentState("loading");
      try {
        const response = await axios.post("/rooms", formData);
        if (response?.status === 201 || response?.status === 200) {
          showToast("Room Created Successfully", "success");
          setComponentState("ready");
        }
      } catch (error) {
        setComponentState("error");
        showToast(getErrorMessage(error), "error");
      }
    },
  });

  return (
    <div className="max-w-[1260px] mx-auto pt-10">
      {(componentState === "error" || componentState === "ready") && (
        <Toast {...toast} />
      )}

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
                accept="image/*"
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
        {touched.description && errors.description && (
          <div className="text-red-500 text-sm mt-2">
            {errors.description as string}
          </div>
        )}

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
        {touched.rulesFiles && errors.rulesFiles && (
          <div className="text-red-500 text-sm mt-2">
            {errors.rulesFiles as string}
          </div>
        )}

        {rulesPreviews.length > 0 && (
          <div className=" gap-2 overflow-x-auto">
            {rulesPreviews.map((_, i) => (
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

        <BedDetails type="multi" bedTypeOptions={bedTypeOptions} />

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
        <div className="bg-[#ffffff] rounded-lg pt-2 pb-4 px-4">
          <GoogleMapComponent
            onLocationSelect={onLocationSelect}
            editAddress={null}
            showRadius={true}
            isClear={false}
          />
        </div>

        {touched.amenities && errors.amenities && (
          <div className="text-red-500 text-sm mt-2">
            {errors.amenities as string}
          </div>
        )}
        <AmenitiesSection
          values={values}
          toggleAmenity={toggleAmenity}
          ticked={ticked}
          untick={untick}
        />

        <div className="w-full flex justify-end items-center">
          <button
            disabled={componentState === "loading" ? true : false}
            type="submit"
            className=" rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
          >
            {componentState === "loading" ? "Creating..." : "Create Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyAdd;
