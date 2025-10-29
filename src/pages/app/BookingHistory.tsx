import { Fragment, useEffect, useState } from "react";
import { nextBtn } from "../../assets/export";
import { useNavigate } from "react-router";
import { BookingFilterDropDown } from "../../components/global/FilterDropDown";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../init/appValues";
import Toast from "../../components/global/Toast";
import PropertyHeaderSkeleton from "../../components/properties/PropertyHeaderSkeleton";
import StatusFilter, {
  type bookingStatus,
  type bookingStatusOption,
} from "../../components/global/StatusFilter";

type bookingStatusProgress = "completed" | "cancelled";

type bookingStatusProgressOption = {
  label: "completed" | "cancelled";
  isActive: boolean;
};

interface BookingHistoryDetail {
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

const BookingHistory = () => {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState(0);
  const [progressActiveStatus, setProgressActiveStatus] = useState(0);

  const [status, setStatus] = useState<bookingStatus>("multi");

  const [progressStatus, setProgressStatus] =
    useState<bookingStatusProgress>("completed");

  const [selectedStatus, setSelectedStatus] = useState<"Daily" | "Monthly">(
    "Monthly"
  );

  const [bookingsHistory, setBookingsHistory] = useState<
    BookingHistoryDetail[]
  >([]);

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

  const statusProgress: bookingStatusProgressOption[] = [
    { label: "completed", isActive: progressActiveStatus === 0 },
    { label: "cancelled", isActive: progressActiveStatus === 1 },
  ];

  const handleStatusChange = (index: number): void => {
    setActiveStatus(index);
  };

  const handleStatusProgressChange = (index: number): void => {
    setProgressActiveStatus(index);
  };

  const getBookingsHistory = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(
        `/booking?roomType=${status}&bookingStatus=${progressStatus}&isMonthly=${
          selectedStatus === "Monthly" ? true : false
        }&page=${pagination?.currentPage ?? 1}`
      );

      if (data.success) {
        setState("ready");
        setBookingsHistory(data?.data?.bookings);
        setPagination(data?.data?.pagination);
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getBookingsHistory();
  }, [status, progressStatus, selectedStatus]);
  return (
    <div className="max-w-[90em] mx-auto py-6 px-[4em]">
      {state === "error" && <Toast {...toast} />}
      <div className="flex items-center gap-3 mt-4">
        <h1 className="text-[26px] font-[600]">Booking History</h1>
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
          <div className="flex items-center w-[240px]">
            {statusProgress?.map((status, index) => (
              <button
                key={index}
                onClick={() => {
                  setProgressStatus(status?.label);
                  handleStatusProgressChange(index);
                }}
                className={`mt-4 ml-2 text-[14px] transition-all duration-200 ease-in-out capitalize space-x-4 w-[80px]  ${
                  status.isActive
                    ? " text-black font-[700] border-b-[1px] border-b-[#29ABE2]"
                    : "text-[#18181899] "
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 py-6 space-y-1">
            <div className="bg-[#FFFFFF] p-4 rounded-3xl space-y-4">
              <h2 className="text-[20px] font-[500] mb-4"> Bookings</h2>

              {bookingsHistory && bookingsHistory.length > 0 ? (
                bookingsHistory.map((booking, index) => (
                  <div key={index} className="p-4 rounded-lg shadow-lite">
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

                            <p className="truncate max-w-[300px] text-[15px] text-[#18181899] font-[400]">
                              {booking?.room?.address}
                            </p>

                            <p className="truncate max-w-[300px] text-[15px] text-[#18181899] font-[400]">
                              {booking?.room?.bedDetails
                                ?.map((item) => item.type)
                                ?.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <p className="text-black font-[500] text-[15px]">
                          ${booking?.totalPrice}{" "}
                          <span className="text-[#18181899] font-[400]">
                            Per Day
                          </span>
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
                            alt="next"
                            className="w-10 h-10 rounded-lg"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No booking found
                </p>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default BookingHistory;
