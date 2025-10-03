import { useState } from "react";

const ProfileEdit = () => {
  const [files, setFiles] = useState<{ profilePreview: string | null }>({
    profilePreview: null,
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.currentTarget.files;
    const file = filesList && filesList[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        profilePreview: URL.createObjectURL(file),
      }));
    }
  };
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col items-center">
      <p className="text-[#000000] text-[16px] font-semibold py-4">
        Edit Profile
      </p>
      <div className="flex flex-col items-center gap-4 py-4">
        <label
          htmlFor="profilePic"
          className="w-20 h-20 rounded-full border-2 border-dashed border-[#36C0EF] flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {files.profilePreview ? (
            <img
              src={files.profilePreview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl text-[#36C0EF]">+</span>
          )}
          <input
            id="profilePic"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      <div className="w-[384px] ">
        <label className="block text-[13px] font-medium text-gray-800 mb-2">
          Full Name
        </label>
        <div className="relative">
          <input
            type="text"
            // value="Mike Smith"
            onChange={() => {}}
            placeholder={"Enter Full Name"}
            maxLength={50}
            className={`w-full px-4 py-4 text-sm rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 field-shadow`}
          />
        </div>
      </div>
      <div className="w-[384px] pt-8">
        <label className="block text-[13px] font-medium text-gray-800 mb-2">
          Work Email
        </label>
        <div className="relative">
          <input
            type="email"
            // value="Mike Smith"
            onChange={() => {}}
            placeholder={"Enter Email"}
            maxLength={50}
            className={`w-full px-4 py-4 text-sm rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 field-shadow`}
          />
        </div>
      </div>
      <div className="w-[384px] ">
        <p className="text-[#18181899] text-[12px] py-4">
          Your email address cannot be changed for security reasons.
        </p>
      </div>

      <button
        type="button"
        className="w-[384px] my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
      >
        Save changes
      </button>
    </div>
  );
};

export default ProfileEdit;
