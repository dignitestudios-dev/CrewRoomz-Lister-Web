import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router";
import { messageIcon, nextBtn } from "../../assets/export";
import { getDateFormat, getErrorMessage } from "../../init/appValues";
import moment from "moment";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import axios from "../../axios";
import Toast from "../../components/global/Toast";
import CancelBookingModal from "../../components/Bookings/CancelBookingModal";

interface Room {
  _id: string;
  state?: string;
  city?: string;
  address?: string;
  media?: string[];
  sharedBath?: number;
  privateBath?: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface Bed {
  type: string;
  price: number;
  monthlyPrice: number;
  _id: string;
}

interface BookingDetails {
  _id: string;
  bookingStatus: string;
  roomType: string;
  totalPrice: number;
  platformFee: number;
  adminCommissionAmount: number;
  adminCommission: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  bed: Bed[];
  room: Room;
  user: User;
}

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingFromState = location.state?.booking; // renamed for clarity
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { toast, showToast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  const [selectedBookingId, setSelectedBookingId] = useState<string>("");

  const handleCancelClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsCancelModalOpen(true);
  };

  // ✅ Fetch booking from backend
  const getBookings = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(`/booking/${bookingFromState?._id}`);
      if (data.success) {
        setBookingDetails(data.data);
        setState("ready");
      } else {
        throw new Error("Failed to fetch booking details");
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    if (bookingFromState?._id) getBookings();
  }, [bookingFromState]);

  // ✅ Loading state safeguard
  if (state === "loading" || !bookingDetails) {
    return (
      <div className="max-w-[1260px] mx-auto pt-10">
        <p className="text-center text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  const startDate = moment(bookingDetails?.startDate);
  const endDate = moment(bookingDetails?.endDate);
  const totalDays = endDate.diff(startDate, "days");

  const days = Math.max(1, totalDays);

  const formatCurrency = (num: number) =>
    num ? `$${num.toFixed(2)}` : "$0.00";

  // 💰 Calculate subtotal from all beds
  const bedCharges =
    bookingDetails?.bed?.map((bed) => {
      return {
        ...bed,
      };
    }) || [];

  // 💳 Final total amount
  const totalAmount =
    (bookingDetails?.totalPrice || 0) -
    (bookingDetails?.adminCommissionAmount || 0);

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
          <div className="h-8 px-3 flex items-center text-[#29ABE2] text-[16px] rounded-4xl bg-blue-100 capitalize">
            {bookingDetails?.bookingStatus}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 py-6 space-y-1">
        {/* LEFT SECTION */}
        <div className="col-span-2">
          <div className=" bg-[#FFFFFF] p-8 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-700 text-[13px]">Booking ID</p>
              <p className="text-black text-[14px] font-[500]">
                {bookingDetails?._id}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Booking Type</p>
              <p className="text-black text-[14px] font-[500] capitalize">
                {bookingDetails?.roomType}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Bed Type</p>
              <p className="text-black text-[14px] font-[500] capitalize">
                {bookingDetails?.bed?.map((b) => b.type).join(", ")} Bed
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Date</p>
              <p className="text-black text-[14px] font-[500]">
                {getDateFormat(bookingDetails?.startDate)} -{" "}
                {getDateFormat(bookingDetails?.endDate)}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-[#E3DBDB] pt-4">
              <p className="text-black text-[18px] font-[600]">
                Crash Pad Details
              </p>
            </div>

            <div className="p-4 rounded-lg shadow-lite space-y-4">
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={bookingDetails?.room?.media?.[0]}
                  alt="room"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-[16px] font-[500]">
                    {bookingDetails?.room?.state}, {bookingDetails?.room?.city}
                  </p>
                  <p className="text-[15px] text-[#18181899] font-[400]">
                    {bookingDetails?.room?.address}
                  </p>
                  {bookingDetails?.room?.sharedBath &&
                    bookingDetails?.room?.privateBath && (
                      <p className="text-[15px] text-[#18181899] font-[400]">
                        {bookingDetails?.room?.sharedBath > 0 &&
                          `${bookingDetails?.room?.sharedBath} Shared Bath, `}
                        {bookingDetails?.room?.privateBath > 0 &&
                          `${bookingDetails?.room?.privateBath} Private Bath`}
                      </p>
                    )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 border-t border-[#E3DBDB]">
                <p className="text-black font-[500] text-[15px]">
                  ${bookingDetails?.totalPrice}
                </p>
                <button
                  onClick={() =>
                    navigate(`/property-details/${bookingDetails?.room?._id}`)
                  }
                  className="cursor-pointer mt-2"
                >
                  <img
                    src={nextBtn}
                    alt="next"
                    className="w-10 h-10 rounded-lg"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div>
          <p className="text-black text-[16px] font-[600]">Guest</p>
          <div className=" bg-[#FFFFFF] px-4 pt-2 rounded-2xl space-y-4 flex justify-between items-center ">
            <div className="flex items-center gap-2 mt-2">
              <img
                src={bookingDetails?.user?.profilePicture}
                alt="user"
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <p className="text-[18px] font-[500]">
                  {bookingDetails?.user?.name}
                </p>
                <p className="text-[15px] text-[#18181899] font-[400]">
                  {bookingDetails?.user?.email}
                </p>
              </div>
            </div>
            <div
              onClick={() => navigate(`/chat/${bookingDetails?.user?._id}`)}
              className="cursor-pointer"
            >
              <img src={messageIcon} alt="message" className="h-12" />
            </div>
          </div>

          <p className="text-black text-[16px] font-[600] my-4">Billing</p>
          <div className="bg-white px-4 py-4 rounded-xl space-y-4">
            {/* Bed Charges */}
            {bedCharges.map((bed) => {
              const extraDays = days > 30 ? days - 30 : 0;
              const basePrice = days > 30 ? bed.monthlyPrice : bed.price * days;
              const extraPrice = extraDays > 0 ? bed.price * extraDays : 0;
              const totalPrice = basePrice + extraPrice;

              const caption =
                days > 30
                  ? `${bed.type} (${Math.floor(days / 30)} month${
                      Math.floor(days / 30) > 1 ? "s" : ""
                    } + ${extraDays} night${extraDays > 1 ? "s" : ""})`
                  : `${bed.type} (${days} night${days > 1 ? "s" : ""})`;

              return (
                <div
                  key={bed._id}
                  className="flex justify-between text-[14px] font-[500] capitalize"
                >
                  <p>{caption}</p>
                  <p>{formatCurrency(totalPrice)}</p>
                </div>
              );
            })}

            {/* Subtotal */}
            <div className="flex justify-between text-[14px] font-[500] text-[#18181899]">
              <p>Total Amount</p>
              <p>{formatCurrency(bookingDetails?.totalPrice)}</p>
            </div>

            {/* Platform Fee */}
            {/* <div className="flex justify-between text-[14px] font-[500] text-[#18181899]">
              <p>Platform Fee (3%)</p>
              <p>{formatCurrency(bookingDetails?.platformFee)}</p>
            </div> */}

            {/* Admin Deduction */}
            <div className="flex justify-between text-[14px] font-[500] text-[#18181899]">
              <p>Deduction ({bookingDetails?.adminCommission} %)</p>
              <p className="text-red-500">
                -{formatCurrency(bookingDetails?.adminCommissionAmount)}
              </p>
            </div>

            {/* Total */}
            <div className="flex justify-between border-t border-[#90909099] border-dashed text-[14px] font-[500] pt-4">
              <p>Final Total</p>
              <p>{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          {bookingDetails?.bookingStatus === "pending" && (
            <div className="py-3 px-1">
              <p className=" text-[14px] font-semibold">Note</p>
              <p className="text-[#18181899] text-[13px]">
                You can cancel a booking within 24 hours at no cost. However, if
                you cancel after 24 hours, a 5% cancellation fee will be
                deducted from your account.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => handleCancelClick(bookingFromState?._id)}
                  type="button"
                  className="w-full rounded-[8px] gradient-color text-white text-[13px] py-3 px-6 font-medium"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isCancelModalOpen && (
        <CancelBookingModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          bookingId={selectedBookingId}
          getBookings={getBookings}
        />
      )}
    </div>
  );
};

export default BookingDetails;
