import React, { useState } from "react";
import { useNavigate } from "react-router";
import { homeOne, nextBtn, user } from "../../assets/export";
import BookingCalendar from "../../components/Calendar/BookingCalendar";
import { BookingFilterDropDown } from "../../components/global/FilterDropDown";

type bookingStatus = "private" | "multi" | "semi";
type bookingStatusOption = {
  label: bookingStatus;
  isActive: boolean;
};

interface StatusIndicatorProps {
  statuses: bookingStatusOption[];
  onStatusChange: (index: number) => void;
  setStatus: React.Dispatch<React.SetStateAction<bookingStatus>>;
}

const StatusIndicator = ({
  statuses,
  onStatusChange,
  setStatus,
}: StatusIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-[450px] px-3 h-[42px] bg-white rounded-full shadow-lite mt-6">
      {statuses?.map((status, index) => (
        <button
          key={index}
          onClick={() => {
            setStatus(status?.label);
            onStatusChange?.(index);
          }}
          className={`px-10 h-[34px] rounded-full text-[14px] transition-all duration-200 ease-in-out capitalize ${
            status.isActive
              ? "gradient-color text-white shadow-md font-[700]"
              : "text-[#181818] hover:text-gray-800 font-[400] hover:bg-gray-50"
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};

const Booking = () => {
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState(0);
  const [status, setStatus] = useState<bookingStatus>("private");
  console.log("🚀 ~ Booking ~ status:", status);

  const statusOptions: bookingStatusOption[] = [
    { label: "private", isActive: activeStatus === 0 },
    { label: "multi", isActive: activeStatus === 1 },
    { label: "semi", isActive: activeStatus === 2 },
  ];

  const bookedRanges = [
    { start: "2025-01-03", end: "2025-01-06" },
    { start: "2025-01-15", end: "2025-01-17" },
    { start: "2025-02-19", end: "2025-02-21" },
  ];
  const cancelledRanges = [{ start: "2025-01-11", end: "2025-01-11" }];

  const handleStatusChange = (index: number): void => {
    setActiveStatus(index);
  };

  return (
    <div className="max-w-[90em] mx-auto py-6 px-[4em]">
      <div className="flex items-center gap-3 mt-4">
        <h1 className="text-[26px] font-[600]">My Bookings</h1>
      </div>
      <div className="flex justify-between items-center w-full">
        <StatusIndicator
          statuses={statusOptions}
          setStatus={setStatus}
          onStatusChange={handleStatusChange}
        />
        <BookingFilterDropDown />
      </div>

      <div className="grid grid-cols-3 gap-8 py-6 space-y-1">
        <div className=" bg-[#FFFFFF] p-4 rounded-3xl grid col-span-2 space-y-4">
          <h2 className="text-[20px] font-[500] mb-4">Ongoing Bookings</h2>
          <div className=" p-4 rounded-lg field-shadow">
            <div className="grid grid-cols-2">
              <div>
                <p className="text-gray-700 text-[12px]">
                  Booking ID: <span className="text-black">123456</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={homeOne}
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
              </div>
              <div className="flex justify-end mt-6">
                <p className="text-black font-[500] text-[15px]">
                  $100{" "}
                  <span className="text-[#18181899] font-[400]">Per Day</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-4 border-t border-[#E3DBDB]">
              <div>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={user}
                    alt="user"
                    className="w-8 h-8 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-[16px] font-[500]">Mike Smith</p>
                    <p className="text-[15px] text-[#18181899] font-[400]">
                      mikesmith@yopmail.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigate(`/booking-details/123`)}
                  className="cursor-pointer"
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
          <div className=" p-4 rounded-lg shadow-lite">
            <div className="grid grid-cols-2">
              <div>
                <p className="text-gray-700 text-[12px]">
                  Booking ID: <span className="text-black">123456</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={homeOne}
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
              </div>
              <div className="flex justify-end mt-6">
                <p className="text-black font-[500] text-[15px]">
                  $100{" "}
                  <span className="text-[#18181899] font-[400]">Per Day</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-4 border-t border-[#E3DBDB]">
              <div>
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={user}
                    alt="user"
                    className="w-8 h-8 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-[16px] font-[500]">Mike Smith</p>
                    <p className="text-[15px] text-[#18181899] font-[400]">
                      mikesmith@yopmail.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigate(`/booking-details/123`)}
                  className="cursor-pointer"
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
        <BookingCalendar
          bookedRanges={bookedRanges}
          cancelledRanges={cancelledRanges}
          bookedClass="bg-[#29ABE226]  border-[1px] border-[#29ABE280] rounded-xl" // uses your gradient class for booked
          cancelledClass="bg-[#FFDCDC] text-red-700 rounded-xl"
          onDayClick={(iso) => {
            console.log("day clicked", iso);
          }}
        />
      </div>
    </div>
  );
};

export default Booking;
