import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";

const ListingCreate = () => {
  const navigate = useNavigate();

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
          <h1 className="text-[26px] font-[600]">Create Listing</h1>
        </div>
      </div>
      <p className="text-[#18181899] text-[15px] font-[500]">
        What type of space are you offering?
      </p>
      <div className="space-y-2 mt-6">
        <div
          onClick={() => navigate("/add-property", { state: "multi" })}
          className="h-[50px] bg-[#ffffff] rounded-lg px-4 text-center cursor-pointer flex items-center justify-between mt-5"
        >
          <p className="text-[16px] font-[500]">Multi</p>
          <IoIosArrowForward className="text-[#18181899]" />
        </div>
        <p className="text-[#18181899] text-[15px] font-[400]">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div
          onClick={() => navigate("/add-property", { state: "semi" })}
          className=" h-[50px] bg-[#ffffff] rounded-lg px-4 text-center cursor-pointer flex items-center justify-between mt-5"
        >
          <p className="text-[16px] font-[400]">Semi-Private</p>
          <IoIosArrowForward className="text-[#18181899]" />
        </div>
        <p className="text-[#18181899] text-[15px] font-[400]">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div
          onClick={() => navigate("/add-property", { state: "private" })}
          className=" h-[50px] bg-[#ffffff] rounded-lg px-4 text-center cursor-pointer flex items-center justify-between "
        >
          <p className="text-[16px] font-[500]">Private</p>
          <IoIosArrowForward className="text-[#18181899]" />
        </div>
        <p className="text-[#18181899] text-[15px] font-[400]">
          Lorem ipsum dolor sit amet consectetur.
        </p>
      </div>
    </div>
  );
};

export default ListingCreate;
