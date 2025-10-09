import { useEffect, useState } from "react";
import { useAppStore } from "../../store/appStore";

const ProfileEdit = () => {
  const { user, fetchUser, updateUser, loading } = useAppStore();

  // Load user info on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Local state for editable fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Handle profile image preview
  const [files, setFiles] = useState<{
    file: File | null;
    preview: string | null;
  }>({
    file: null,
    preview: null,
  });

  // Populate form when user data is fetched
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setFiles({
        file: null,
        preview: user.profilePicture || null,
      });
    }
  }, [user]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setFiles({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle update submit
  const handleUpdate = async () => {
    try {
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      if (files.file) updatedData.append("profilePicture", files.file);

      await updateUser(updatedData); // updates Zustand store globally
      await fetchUser(); // refresh latest user info from backend
    } catch (error) {
      console.log("🚀 ~ handleUpdate ~ error:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col items-center">
      <p className="text-[#000000] text-[16px] font-semibold py-4">
        Edit Profile
      </p>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center gap-4 py-4">
        <label
          htmlFor="profilePic"
          className="w-20 h-20 rounded-full border-2 border-dashed border-[#36C0EF] flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {files.preview ? (
            <img
              src={files.preview}
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

      {/* Full Name Field */}
      <div className="w-[384px]">
        <label className="block text-[13px] font-medium text-gray-800 mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Full Name"
          maxLength={50}
          className="w-full px-4 py-4 text-sm rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 field-shadow"
        />
      </div>

      {/* Email Field */}
      <div className="w-[384px] pt-8">
        <label className="block text-[13px] font-medium text-gray-800 mb-2">
          Work Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-4 text-sm rounded-xl bg-gray-100 cursor-not-allowed pr-12 field-shadow"
        />
        <p className="text-[#18181899] text-[12px] py-2">
          Your email address cannot be changed for security reasons.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpdate}
        type="button"
        disabled={loading}
        className={`w-[384px] my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ProfileEdit;
