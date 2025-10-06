import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { messageIcon, nextBtn, user } from "../../assets/export";

const BookingDetails = () => {
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
          <h1 className="text-[26px] font-[600]">Property Details</h1>
          <div className="h-8 px-3 flex items-center text-[#29ABE2] text-[16px] rounded-4xl bg-blue-100">
            Upcoming
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 py-6 space-y-1">
        <div className="col-span-2">
          <div className=" bg-[#FFFFFF] p-8 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-700 text-[13px]">Booking ID</p>
              <p className="text-black text-[14px] font-[500]">123456</p>
            </div>
            <div className="flex justify-between items-center border-t  border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Booking Type</p>
              <p className="text-black text-[14px] font-[500]">Daily</p>
            </div>
            <div className="flex justify-between items-center border-t  border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Bed Type</p>
              <p className="text-black text-[14px] font-[500]">
                King Size, Single Bed
              </p>
            </div>
            <div className="flex justify-between items-center border-t  border-[#E3DBDB] py-4">
              <p className="text-gray-700 text-[13px]">Date</p>
              <p className="text-black text-[14px] font-[500]">12-12-25</p>
            </div>
            <div className="flex justify-between items-center border-t border-[#E3DBDB] pt-4">
              <p className="text-black text-[18px] font-[600]">
                Crash Pad Details
              </p>
            </div>
            <div className=" p-4 rounded-lg shadow-lite space-y-4">
              <div className="flex items-center gap-2 mt-2">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="user"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-[16px] font-[500]">Gaular, Norway</p>
                  <p className="text-[15px] text-[#18181899] font-[400]">
                    456 Maple Street, Anytown, NY 12345
                  </p>
                  <p className="text-[15px] text-[#18181899] font-[400]">
                    1 King Bed, 1 Private Bath
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-2 border-t border-[#E3DBDB]">
                <button
                  onClick={() => navigate(`/property-details/123`)}
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
                src={user}
                alt="user"
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <p className="text-[18px] font-[500]">Mike Smith</p>
                <p className="text-[15px] text-[#18181899] font-[400]">
                  mikesmith@yopmail.com
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
              <p>$100</p>
            </div>
            <div className=" flex justify-between text-[14px] font-[500] text-[#18181899] ">
              <p>Sub Total</p>
              <p>$100</p>
            </div>
            <div className=" flex justify-between border-t-[1px] border-[#90909099] border-dashed text-[14px] font-[500] pt-4">
              <p> Total</p>
              <p>$100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
