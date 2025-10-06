import { useNavigate } from "react-router";
import ImageGallery from "../../components/global/ImageGallery";
import {
  bgChecked,
  homeOne,
  homeTwo,
  locate,
  pdfIcon,
  setting,
  user,
} from "../../assets/export";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuMapPin } from "react-icons/lu";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import PropertyReviewModal from "../../components/properties/PropertyReviewModal";
import ConfirmationModal from "../../components/global/ConfirmationModal";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const images = [homeOne, homeTwo];
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
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
          <h1 className="text-[26px] font-[600]">Property Details</h1>
          <div className="h-8 px-3 flex items-center text-white text-[16px] rounded-4xl bg-green-500">
            {" "}
            Active
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-[97px] bg-transparent text-black border border-[#E3DBDB] text-[14px] flex items-center justify-center rounded-3xl font-medium ">
            Deactivate
          </button>
          <button
            onClick={() => setIsDelete(true)}
            className="w-[97px] bg-[#DC1D00] text-white text-[14px] flex items-center justify-center gap-3 rounded-3xl px-6 py-1 font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => navigate("/add-property")}
            className="w-[97px] gradient-color text-white text-[14px] flex items-center justify-center gap-3 rounded-3xl px-6 py-1 font-medium"
          >
            Edit
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4 rounded-2xl">
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row gap-4">
            <ImageGallery images={images} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-14 p-4 space-y-1">
          <div>
            <h2 className="text-[32px] font-semibold mb-2">Abc Xyz</h2>
            <div className="flex gap-1 items-start">
              <LuMapPin size={18} className=" text-gray-500" />
              <p className="text-[#494949] font-[500] text-[18px]">
                123 Main St, City, Country
              </p>
            </div>
            <div className="flex gap-1 items-start cursor-pointer ">
              <img src={locate} alt="location" className="h-6" />
              <p className="text-[#006AFF] text-[16px] underline">
                Show on google map
              </p>
            </div>
            <p className=" font-[500] text-[16px]">
              123 Main St, City, Country
            </p>
            <div className="mt-6">
              <h2 className="text-[20px] font-[500] mb-2">Amenities</h2>
              <div className="grid grid-cols-5 gap-1">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-[#FFFFFF] w-[91px] h-[74px] rounded-lg shadow-[#F5F5F5] flex flex-col items-center justify-center p-4 gap-2 mt-0.5"
                    >
                      <img src={setting} alt="abc" className="h-8" />
                      <p className="text-center text-[12px] font-[400]">Wifi</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-6 border-t pt-4 border-[#18181829]">
              <h2 className="text-[20px] font-[500] mb-2">Description</h2>
              <p className="text-[16px] text-[#18181899] font-[400] text-justify">
                this is description
              </p>
            </div>
            <div className="mt-6 border-t pt-4 border-[#18181829]">
              <h2 className="text-[20px] font-[500] mb-2">Rules to live</h2>
              <div className="flex items-center gap-2 bg-white w-[280px] h-[50px] rounded-lg shadow-[#F5F5F5] p-2 mt-0.5">
                <img src={pdfIcon} alt="pdf" className="w-5 h-5" />
                <p className="text-sm">Rules</p>
              </div>
            </div>
          </div>
          <div>
            <div className=" bg-[#FFFFFF] p-4 rounded-3xl ">
              <h2 className="text-[20px] font-[500] mb-4">Prices</h2>
              <div className=" mb-4">
                <p className="text-[16px] font-[500]">King bed</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="border border-blue-400 rounded-xl w-[200px]">
                    <p className="text-[14px] px-3">Daily</p>
                    <p className="text-[14px] text-blue-400 px-3">$120</p>
                  </div>
                  <div className="border border-blue-400 rounded-xl w-[200px]">
                    <p className="text-[14px] px-3">Monthly</p>
                    <p className="text-[14px] text-blue-400 px-3">$50</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 mb-2 flex justify-between items-center">
              <h2 className="text-[20px] font-[500] ">Reviews</h2>{" "}
              <button
                onClick={() => {
                  setShowAllReviews(true);
                }}
                className="cursor-pointer text-[#666666] text-[15px]"
              >
                View All
              </button>
            </div>
            <div className=" bg-[#FFFFFF] p-4 rounded-3xl text-[14px]">
              <div className="flex items-center gap-2 mb-2">
                <FaStar className="text-yellow-400 text-xl" /> <p>4.5</p>
              </div>

              <p className="text-[#666666]">Jan 22, 2024</p>
              <p>
                PipeGuard Inspection was excellent! Professional service, clear
                explanations, and peace of mind. Highly recommended!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <img src={user} alt="user" className="w-8 h-8 rounded-full" />
                <p className="text-[16px] font-[500]">Abc Xyz</p>
              </div>
            </div>
          </div>
        </div>
        {showAllReviews && (
          <PropertyReviewModal
            breakdown={{ 5: 18, 4: 8, 3: 9, 2: 6, 1: 2 }}
            onClose={() => setShowAllReviews(false)}
          />
        )}
        {isDelete && (
          <ConfirmationModal
            title="Delete Listing"
            content="Are you sure you want to delete this listing?"
            skipBtnContent="No"
            confirmBtnContent="Delete"
            onClose={() => setIsDelete(false)}
            onSubmit={() => {
              setIsDelete(false);
              setDeleteSuccess(true);
            }}
          />
        )}
        {deleteSuccess && (
          <div className="fixed inset-0 bg-[#04080680] bg-opacity-0 z-50 flex items-center justify-center">
            <div
              onClick={() => setDeleteSuccess(false)}
              className="bg-white rounded-2xl p-6 w-[400px] text-center shadow-lg  flex flex-col justify-center items-center relative"
            >
              <div className="absolute -top-10">
                <img src={bgChecked} alt="abc" className="w-20 h-20" />
              </div>
              <p className="text-[20px] text-[#181818] font-semibold mt-8 mb-2">
                Listing Deleted!
              </p>
              <p className="text-[15px] text-[#18181899] my-2">
                The listing has been successfully deleted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
