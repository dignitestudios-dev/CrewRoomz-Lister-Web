import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router";
import { messageIcon, nextBtn } from "../../assets/export";
import { getDateFormat } from "../../init/appValues";

const BookingDetails = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const booking = location.state.booking;
  console.log("🚀 ~ BookingDetails ~ booking:", booking);

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
          <div className="h-8 px-3 flex items-center text-[#29ABE2] text-[16px] rounded-4xl bg-blue-100 capitalize">
            {booking?.bookingStatus}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 py-6 space-y-1">
        <div className="col-span-2">
          <div className=" bg-[#FFFFFF] p-8 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-700 text-[13px]">Booking ID</p>
              <p className="text-black text-[14px] font-[500]">
                {booking?._id}
              </p>
            </div>
            <div className="flex justify-between items-center border-t  border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Booking Type</p>
              <p className="text-black text-[14px] font-[500] capitalize">
                {booking?.roomType}
              </p>
            </div>
            <div className="flex justify-between items-center border-t  border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Bed Type</p>
              <p className="text-black text-[14px] font-[500] capitalize">
                {booking?.bed
                  ?.map((item: { type: string }) => item.type)
                  ?.join(", ")}
              </p>
            </div>
            <div className="flex justify-between items-center border-t  border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Date</p>
              <p className="text-black text-[14px] font-[500]">
                {getDateFormat(booking?.createdAt)}
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-[#E3DBDB] pt-4">
              <p className="text-black text-[18px] font-[600]">
                Crash Pad Details
              </p>
            </div>
            <div className=" p-4 rounded-lg shadow-lite space-y-4">
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={booking?.room?.media[0]}
                  alt="user"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-[16px] font-[500]">
                    {booking?.room?.state}, {booking?.room?.city}
                  </p>
                  <p className="text-[15px] text-[#18181899] font-[400]">
                    {booking?.room?.address}
                  </p>

                  {booking?.room && (
                    <p className=" text-[15px] text-[#18181899] font-[400]">
                      {booking?.room?.sharedBath > 0 &&
                        booking?.room?.sharedBath + " Shared Bath"}
                      ,
                      {booking?.room?.privateBath > 0 &&
                        booking?.room?.privateBath + " Private Bath"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-2 border-t border-[#E3DBDB]">
                <button
                  onClick={() =>
                    navigate(`/property-details/${booking?.room?._id}`)
                  }
                  className="cursor-pointer mt-2"
                >
                  <img
                    src={nextBtn}
                    alt="user"
                    className="w-10 h-10 rounded-lg"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-black text-[16px] font-[600]">Guest</p>
          <div className=" bg-[#FFFFFF] px-4 pt-2 rounded-2xl space-y-4 flex justify-between items-center ">
            <div className="flex items-center gap-2 mt-2">
              <img
                src={booking?.user?.profilePicture}
                alt="user"
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <p className="text-[18px] font-[500]">{booking?.user?.name}</p>
                <p className="text-[15px] text-[#18181899] font-[400]">
                  {booking?.user?.email}
                </p>
              </div>
            </div>
            <div>
              <img src={messageIcon} alt="message" className="h-12" />
            </div>
          </div>
          <p className="text-black text-[16px] font-[600] my-4">Billing</p>
          <div className=" bg-[#FFFFFF] px-4 py-4 rounded-xl space-y-4">
            <div className=" flex justify-between text-[14px] font-[500]">
              <p>King Bed</p>
            </div>
            <div className=" flex justify-between text-[14px] font-[500] text-[#18181899] ">
              <p>Stay $100*1</p>
              <p>${}</p>
            </div>
            <div className=" flex justify-between text-[14px] font-[500] text-[#18181899] ">
              <p>Admin Commission</p>
              <p>${booking?.adminCommissionAmount}</p>
            </div>
            <div className=" flex justify-between text-[14px] font-[500] text-[#18181899] ">
              <p>Sub Total</p>
              <p>${booking?.platformFee}</p>
            </div>
            <div className=" flex justify-between border-t-[1px] border-[#90909099] border-dashed text-[14px] font-[500] pt-4">
              <p> Total</p>
              <p>${booking?.totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
