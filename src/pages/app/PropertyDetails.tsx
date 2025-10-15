import { useNavigate, useParams } from "react-router";
import ImageGallery from "../../components/global/ImageGallery";
import { bgChecked, locate, pdfIcon, setting, user } from "../../assets/export";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuMapPin } from "react-icons/lu";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import PropertyReviewModal from "../../components/properties/PropertyReviewModal";
import ConfirmationModal from "../../components/global/ConfirmationModal";
import { useToast } from "../../hooks/useToast";
import axios from "../../axios";
import { getErrorMessage } from "../../init/appValues";
import Toast from "../../components/global/Toast";
import PropertyHeaderSkeleton from "../../components/properties/PropertyHeaderSkeleton";
import BedPricing from "../../components/Bookings/BedPricing";

interface PropertyDetail {
  _id: string | number; // allow both
  city: string;
  state: string;
  address: string;
  bedDetails?: BedDetail[];
  media: string[];
  roomStatus?: string;
  amenities: string[];
  lister: Lister;
  location: Location;
  privateBath: number;
  sharedBath: number;
  description: string;
  rulesDocument: string;
}

interface BedDetail {
  type: string;
  price: number;
  monthlyPrice: number;
  _id: string;
}

interface Lister {
  email: string;
  name: string;
  profilePicture: string;
  _id: string;
}

interface Location {
  coordinates: number[];
  type: string;
}

interface Review {
  bookingId: string;
  createdAt: string;
  rating: number;
  review: string;
  room: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    profilePicture?: string;
  };
  _id: string;
}

// interface RatingDistribution {
//   1: number;
//   2: number;
//   3: number;
//   4: number;
//   5: number;
// }
type RatingDistribution = Record<number, number>;
interface RoomReviews {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
  // pagination: Pagination;
  reviews: Review[];
}

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");
  const [roomDetails, setRoomDetails] = useState<PropertyDetail>();
  const [roomReviews, setRoomReviews] = useState<RoomReviews>();
  console.log("🚀 ~ PropertyDetails ~ roomReviews:", roomReviews);

  const openDoc = (url?: string) => {
    if (!url) {
      console.warn("No document URL provided");
      return;
    }
    const fullUrl = url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_BASE_URL}${url}`;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const getRooms = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(`/rooms/${id}`);
      if (data.success) {
        setRoomDetails(data?.data?.room);
        setState("ready");
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  const getRoomReviews = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(`/rooms/roomDetails/${id}`);
      if (data.success) {
        setState("ready");
        setRoomReviews(data?.data);
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getRooms();
    getRoomReviews();
  }, []);

  return (
    <div className="max-w-[1260px] mx-auto pt-10">
      {state === "error" && <Toast {...toast} />}
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
      {state === "loading" ? (
        <PropertyHeaderSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4 rounded-2xl">
          <div className="md:col-span-2">
            <div className="flex flex-col md:flex-row gap-4">
              <ImageGallery images={roomDetails?.media} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-14 p-4 space-y-1">
            <div>
              <h2 className="text-[32px] font-semibold mb-2">
                {roomDetails?.state},{roomDetails?.city}
              </h2>
              <div className="flex gap-1 items-start">
                <LuMapPin size={18} className=" text-gray-500" />
                <p className="text-[#494949] font-[500] text-[18px]">
                  {roomDetails?.address}
                </p>
              </div>
              <div className="flex gap-1 items-start cursor-pointer ">
                <img src={locate} alt="location" className="h-6" />
                <p className="text-[#006AFF] text-[16px] underline">
                  Show on google map
                </p>
              </div>
              {roomDetails && (
                <p className=" font-[500] text-[16px]">
                  {roomDetails!.sharedBath > 0 &&
                    roomDetails?.sharedBath + "Shared bath"}
                  ,{" "}
                  {roomDetails!.privateBath > 0 &&
                    roomDetails?.sharedBath + "Private bath"}
                </p>
              )}
              <div className="mt-6">
                <h2 className="text-[20px] font-[500] mb-2">Amenities</h2>
                <div className="grid grid-cols-5 gap-1">
                  {roomDetails?.amenities?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#FFFFFF] w-[91px] h-[74px] rounded-lg shadow-[#F5F5F5] flex flex-col items-center justify-center p-4 gap-2 mt-0.5"
                    >
                      <img src={setting} alt="abc" className="h-8" />
                      <p className="text-center text-[12px] font-[400]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t pt-4 border-[#18181829]">
                <h2 className="text-[20px] font-[500] mb-2">Description</h2>
                <p className="text-[16px] text-[#18181899] font-[400] text-justify">
                  {roomDetails?.description}
                </p>
              </div>
              <div className="mt-6 border-t pt-4 border-[#18181829]">
                <h2 className="text-[20px] font-[500] mb-2">Rules to live</h2>
                <div
                  onClick={() => openDoc(roomDetails?.rulesDocument)}
                  className="cursor-pointer flex items-center gap-2 bg-white w-[280px] h-[50px] rounded-lg shadow-[#F5F5F5] p-2 mt-0.5"
                >
                  <img src={pdfIcon} alt="pdf" className="w-5 h-5" />
                  <p className="text-sm">Rules</p>
                </div>
              </div>
            </div>
            <div>
              <BedPricing bedDetails={roomDetails?.bedDetails || []} />

              {roomReviews && roomReviews!.reviews.length > 0 ? (
                <>
                  <div className="mt-2 mb-2 flex justify-between items-center">
                    <h2 className="text-[20px] font-[500]">Reviews</h2>
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="cursor-pointer text-[#666666] text-[15px]"
                    >
                      View All
                    </button>
                  </div>

                  {roomReviews!.reviews.slice(0, 1).map((review) => (
                    <div
                      key={review._id}
                      className="bg-[#FFFFFF] p-4 rounded-3xl text-[14px] mb-2"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="text-yellow-400 text-xl" />
                        <p>{review.rating.toFixed(1)}</p>
                      </div>

                      <p className="text-[#666666]">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>

                      <p className="mt-1">{review.review}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={review.user.profilePicture || user}
                          alt="user"
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="text-[16px] font-[500]">
                          {review.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="bg-white p-4 rounded-3xl text-center text-gray-500 mt-4">
                  <p className="text-[15px] font-[500]">No reviews yet</p>
                </div>
              )}
            </div>
          </div>
          {showAllReviews && (
            <>
              {roomReviews?.ratingDistribution !== undefined && (
                <PropertyReviewModal
                  breakdown={roomReviews.ratingDistribution}
                  reviews={roomReviews.reviews}
                  onClose={() => setShowAllReviews(false)}
                />
              )}
            </>
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
              loading="false"
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
      )}
    </div>
  );
};

export default PropertyDetails;
