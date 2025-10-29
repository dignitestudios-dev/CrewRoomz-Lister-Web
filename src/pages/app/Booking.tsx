import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { nextBtn } from "../../assets/export";
import BookingCalendar from "../../components/Calendar/BookingCalendar";
import { BookingFilterDropDown } from "../../components/global/FilterDropDown";
import Pagination from "../../components/global/Pagination";
import { useToast } from "../../hooks/useToast";
import axios from "../../axios";
import {
  convertToRanges,
  getErrorMessage,
  type DateRange,
} from "../../init/appValues";
import PropertyHeaderSkeleton from "../../components/properties/PropertyHeaderSkeleton";
import Toast from "../../components/global/Toast";
import StatusFilter, {
  type bookingStatus,
  type bookingStatusOption,
} from "../../components/global/StatusFilter";

interface BookingDetail {
  _id: string | number; // allow both
  room: RoomDetail;
  user: User;
  totalPrice: number;
}

interface RoomDetail {
  city: string;
  state: string;
  address: string;
  bedDetails?: BedDetail[];
  media: string[];
}
interface BedDetail {
  type: string;
  price: number;
  monthlyPrice: number;
  _id: string;
}

interface User {
  email: string;
  name: string;
  profilePicture: string;
  _id: string;
}

const Booking = () => {
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState(0);
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [status, setStatus] = useState<bookingStatus>("multi");
  const [selectDate, setSelectDate] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<SelectedStatus>("Monthly");

  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
  });

  const statusOptions: bookingStatusOption[] = [
    { label: "multi", isActive: activeStatus === 0 },
    { label: "semi-private", isActive: activeStatus === 1 },
    { label: "private", isActive: activeStatus === 2 },
  ];

  const today = new Date().toISOString().split("T")[0];

  const [bookedRanges, setBookedRanges] = useState<DateRange[]>([]);
  const cancelledRanges = [{ start: "2025-01-11", end: "2025-01-11" }];

  const handleStatusChange = (index: number): void => {
    setActiveStatus(index);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getBookings = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(
        `/booking/bookingsByDate/list?roomType=${status}&date=${
          selectDate || today
        }&bookingStatus=pending&isMonthly=${
          selectedStatus === "Monthly" ? true : false
        }&page=${pagination?.currentPage ?? 1}`
      );
      if (data.success) {
        setState("ready");
        const result = convertToRanges(data?.data?.bookedDates);
        setBookedRanges(result);
        setBookings(data?.data?.bookings);
        setPagination(data?.data?.pagination);
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getBookings();
  }, [status, selectDate, selectedStatus]);

  return (
    <div className="max-w-[90em] mx-auto py-6 px-[4em]">
      {state === "error" && <Toast {...toast} />}
      <div className="flex items-center gap-3 mt-4">
        <h1 className="text-[26px] font-[600]">My Bookings</h1>
      </div>

      <div className="flex justify-between items-center w-full">
        <StatusFilter
          statuses={statusOptions}
          setStatus={setStatus}
          onStatusChange={handleStatusChange}
        />
        <BookingFilterDropDown
          selected={selectedStatus}
          setSelected={setSelectedStatus}
        />
      </div>

      {state === "loading" ? (
        <div className="mt-4">
          <PropertyHeaderSkeleton />
        </div>
      ) : (
        <Fragment>
          <div className="grid grid-cols-3 gap-8 py-6 space-y-1">
            <div className=" bg-[#FFFFFF] p-4 rounded-3xl grid col-span-2">
              <h2 className="text-[20px] font-[500] mb-4">Ongoing Bookings</h2>

              {bookings && bookings.length > 0 ? (
                bookings?.map((booking, index) => (
                  <div
                    key={index}
                    className=" p-4 rounded-lg field-shadow mb-2 "
                  >
                    <div className="grid grid-cols-2">
                      <div>
                        <p className="text-gray-700 text-[12px]">
                          Booking ID:{" "}
                          <span className="text-black">{booking?._id}</span>
                        </p>
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
                            <p className="truncate max-w-[310px] text-[15px] text-[#18181899] font-[400]">
                              {booking?.room?.address}
                            </p>
                            <p className="w-[310px] text-[15px] text-[#18181899] font-[400]">
                              {booking?.room?.bedDetails
                                ?.map((item) => item.type)
                                ?.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <p className="text-black font-[500] text-[15px]">
                          ${booking?.totalPrice}
                          {/* <span className="text-[#18181899] font-[400]">
                            Per Day
                          </span> */}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 mt-4 border-t border-[#E3DBDB]">
                      <div>
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={booking?.user?.profilePicture}
                            alt="user"
                            className="w-8 h-8 rounded-2xl object-cover"
                          />
                          <div>
                            <p className="text-[16px] font-[500]">
                              {booking?.user?.name}
                            </p>
                            <p className="text-[15px] text-[#18181899] font-[400]">
                              {booking?.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() =>
                            navigate(`/booking-details/${booking?._id}`, {
                              state: { booking },
                            })
                          }
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
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No bookings yet. Once a bed is booked, it will appear here.
                </p>
              )}
            </div>
            <BookingCalendar
              bookedRanges={bookedRanges}
              cancelledRanges={cancelledRanges}
              bookedClass="bg-[#29ABE226]  border-[1px] border-[#29ABE280] rounded-xl" // uses your gradient class for booked
              cancelledClass="bg-[#FFDCDC] text-red-700 rounded-xl"
              onDayClick={(iso) => {
                setSelectDate(iso);
              }}
            />
          </div>
        </Fragment>
      )}

      <Pagination
        currentPage={pagination?.currentPage ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Booking;
