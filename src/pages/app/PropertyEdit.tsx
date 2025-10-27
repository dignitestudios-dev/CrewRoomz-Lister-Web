import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "../../axios";
import { useFormik } from "formik";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/global/Toast";
import GoogleMapComponent from "../../components/global/GoogleMap";
import { getErrorMessage } from "../../init/appValues";
import { AMENITY_GROUPS } from "../../statics/amenities";
import { pdfIcon, ticked, untick } from "../../assets/export";
import { HiOutlinePlus } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { bedTypeOptions } from "../../statics/bedOptions";
// import { bedReducer, initialState } from "../../init/roomValues";
import EditBedDetails from "../../components/properties/EditBedDetails";
import { prepareBedDataForSubmit } from "../../init/roomValues";

interface InitialValues {
  description: string;
  amenities: string[];
  sharedBath: string;
  privateBath: string;
  images: File[]; // or string[] if they’re URLs
  rulesFiles: File[]; // same note here
}

const PropertyEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  console.log("🚀 ~ PropertyEdit ~ location:", location);
  const room = location.state.room;
  const { toast, showToast } = useToast();
  const [componentState, setComponentState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  const [address, setAddress] = useState<EditAddress | null>(null);
  // const [state, dispatch] = useReducer(bedReducer, initialState);

  const [bedData, setBedData] = useState<Bed[]>([]);
  const [deletedBedIds, setDeletedBedIds] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // For previews and file tracking
  const [rulesPreviews, setRulesPreviews] = useState<string[]>([]);
  const [newRulesFiles, setNewRulesFiles] = useState<File[]>([]);

  const [initialValues, setInitialValues] = useState<InitialValues>({
    description: "",
    amenities: [],
    sharedBath: "",
    privateBath: "",
    images: [],
    rulesFiles: [],
  });

  // Handle file upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    const previewURLs = selectedFiles.map((file) => URL.createObjectURL(file));

    setImagePreviews((prev) => [...prev, ...previewURLs]);
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    // const removed = imagePreviews[index];

    // If it’s an existing image (URL from backend), track it for deletion
    // if (removed.startsWith("http")) {
    //   setRemovedImages((prev) => [...prev, removed]);
    // }

    // Remove from both preview and new files if needed
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const previews = files.map((f) => URL.createObjectURL(f));

    setNewRulesFiles((prev) => [...prev, ...files]);
    setRulesPreviews((prev) => [...prev, ...previews]);

    // Keep Formik in sync
    setFieldValue("rulesFiles", [...(values.rulesFiles || []), ...files]);
  };

  const handleRemoveRules = (index: number) => {
    const preview = rulesPreviews[index];

    // Track if user removes an existing file (from backend)
    if (preview.startsWith("http")) {
      // setRemovedRules((prev) => [...prev, preview]);
    } else if (preview.startsWith("blob:")) {
      // Clean up blob URLs
      try {
        URL.revokeObjectURL(preview);
      } catch {
        console.log("Error revoking blob URL");
      }
    }

    // Remove preview
    const updatedPreviews = rulesPreviews.filter((_, i) => i !== index);
    setRulesPreviews(updatedPreviews);

    // Remove from new uploads if applicable
    const updatedFiles = newRulesFiles.filter((_, i) => i !== index);
    setNewRulesFiles(updatedFiles);

    // Update Formik field
    const currentFiles: File[] = values.rulesFiles || [];
    const filteredFiles = currentFiles.filter((_, i) => i !== index);
    setFieldValue("rulesFiles", filteredFiles);
  };

  // ✅ Fetch data for editing
  useEffect(() => {
    setInitialValues((prev) => ({
      ...prev,
      description: room.description || "",
      amenities: room.amenities || [],
      sharedBath: room.sharedBath || "",
      privateBath: room.privateBath || "",
    }));

    setImagePreviews(room.media || []);
    if (room.rulesDocument) setRulesPreviews([room.rulesDocument]);

    setAddress({
      address: room.address,
      city: room.city,
      state: room.state,
      location: {
        lat: room.location?.coordinates?.[1],
        lng: room.location?.coordinates?.[0],
      },
    });
  }, [room]);

  const { values, setFieldValue, handleChange, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues,

    onSubmit: async (values) => {
      if (!address) {
        showToast("Please select an address on the map", "error");
        return;
      }

      const formData = new FormData();
      prepareBedDataForSubmit(bedData, formData);
      formData.append("description", values.description);
      formData.append("sharedBath", values.sharedBath);
      formData.append("privateBath", values.privateBath);
      formData.append("addAmenities", (values.amenities || []).join(","));
      formData.append("address", address.address);
      formData.append("city", address.city);
      formData.append("state", address.state);
      formData.append("location", JSON.stringify(address.location));

      if (values.images && values.images.length > 0) {
        values.images.forEach((file: File) => formData.append("media", file));
      }
      if (values.rulesFiles && values.rulesFiles.length > 0) {
        formData.append("rulesDocument", values.rulesFiles[0]);
      }

      if (deletedBedIds && deletedBedIds.length > 0) {
        formData.append("bedDetailsToRemove", deletedBedIds.join(","));
      }

      try {
        setComponentState("loading");
        const res = await axios.put(`/rooms/${id}`, formData);
        if (res.status === 200 || res.status === 201) {
          showToast("Room Updated Successfully", "success");
          setComponentState("ready");
        }
      } catch (error) {
        showToast(getErrorMessage(error), "error");
        setComponentState("error");
      }
    },
  });

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

  const onLocationSelect = (data: EditAddress) => {
    setAddress(data);
  };

  const handleBedDataChange = (beds: Bed[], deletedIds: string[]) => {
    setBedData(beds);
    setDeletedBedIds(deletedIds);
  };

  return (
    <div className="max-w-[1260px] mx-auto pt-10">
      {(componentState === "error" || componentState === "ready") && (
        <Toast {...toast} />
      )}

      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="cursor-pointer"
          >
            <FaArrowLeftLong size={16} />
          </button>
          <h1 className="text-[26px] font-[600]">Edit Property</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 p-4 space-y-2">
        <div className="border-[2px] border-dashed bg-gray-50 border-[#36C0EF] rounded-lg pt-2 pb-4 px-4 text-center block">
          <div className="flex justify-start pb-4">
            <p>Upload photos/videos</p>
          </div>

          <div className="bg-white p-6 rounded-lg cursor-pointer">
            <label
              htmlFor="fileUpload"
              className="rounded-lg p-10 text-center cursor-pointer"
            >
              <div className="flex flex-col items-center gap-2">
                <HiOutlinePlus className="text-[#36C0EF] text-3xl text-center" />
                <p className="text-[#36C0EF] text-[14px]">Upload</p>
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

            {/* {touched.images && errors.images && (
      <div className="text-red-500 text-sm mt-2">
        {errors.images as string}
      </div>
    )} */}
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {imagePreviews.map((src, i) =>
                src.endsWith(".mp4") ? (
                  <video key={i} src={src} className="h-20 rounded-md" />
                ) : (
                  <div className="relative" key={i}>
                    <img
                      src={src}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="cursor-pointer absolute top-0 right-0"
                    >
                      <RxCross2 className="text-red-500 text-2xl bg-red-50 rounded-tr-xl" />
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
          name="description"
          value={values.description}
          onChange={handleChange}
        ></textarea>

        <label className="text-[16px] font-[500]">Rules to stay</label>
        <div className="border-[2px] border-dashed bg-[#ffffff] border-[#36C0EF] rounded-xl pt-2 pb-4 px-4 text-center block mb-6">
          <label
            htmlFor="rulesUpload"
            className="rounded-lg p-10 text-center cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <HiOutlinePlus className="text-[#36C0EF] text-3xl text-center" />
              <p className="text-[#36C0EF] text-[14px]">Upload</p>
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

        {/* {touched.rulesFiles && errors.rulesFiles && (
  <div className="text-red-500 text-sm mt-2">{errors.rulesFiles as string}</div>
)} */}

        {rulesPreviews.length > 0 && (
          <div className="gap-2 overflow-x-auto">
            {rulesPreviews.map((_, i) => (
              <div key={i} className="bg-white rounded-lg py-4 relative my-1">
                <img
                  src={pdfIcon}
                  className="h-6 px-4 absolute rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRules(i)}
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

        <EditBedDetails
          roomType={room.roomType}
          bedTypeOptions={bedTypeOptions}
          bedDetails={room.bedDetails || []}
          onBedDataChange={handleBedDataChange}
        />

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
            {/* {touched.sharedBath && errors.sharedBath && (
              <div className="text-red-500 text-sm mt-1">
                {errors.sharedBath}
              </div>
            )} */}
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
            {/* {touched.privateBath && errors.privateBath && (
              <div className="text-red-500 text-sm mt-1">
                {errors.privateBath}
              </div>
            )} */}
          </div>
        </div>

        {/* Address */}
        <label className="text-[16px] font-[500] pt-4">Address</label>
        <div className="bg-[#ffffff] rounded-lg pt-2 pb-4 px-4">
          <GoogleMapComponent
            onLocationSelect={onLocationSelect}
            editAddress={address}
            showRadius={true}
            isClear={false}
          />
        </div>

        {/* Amenities */}
        <div className=" pt-4 border-t-2 border-t-[#E3E3E3]">
          <p className="text-[20px] font-semibold">Amenities</p>
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
            disabled={componentState === "loading"}
            type="submit"
            className="rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
          >
            {componentState === "loading" ? "Updating..." : "Update Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEdit;
