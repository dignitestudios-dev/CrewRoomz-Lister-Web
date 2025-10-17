import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { dotBar } from "../../assets/export.ts";
import { HomeFilterDropDown } from "../../components/global/FilterDropDown.tsx";
import PropertyCard from "../../components/properties/PropertyCard.tsx";
import axios from "../../axios.ts";
import { useToast } from "../../hooks/useToast.ts";
import { getErrorMessage } from "../../init/appValues.ts";
import Toast from "../../components/global/Toast.tsx";
import HomeSkeleton from "../../components/properties/HomeSkeleton.tsx";
import Pagination from "../../components/global/Pagination.tsx";
import { useAppStore } from "../../store/appStore.ts";
import type {
  bookingStatus,
  bookingStatusOption,
} from "../../components/global/StatusFilter.tsx";
import StatusFilter from "../../components/global/StatusFilter.tsx";

const Home = () => {
  const { user } = useAppStore();

  const navigate = useNavigate();

  const [status, setStatus] = useState<bookingStatus>("multi");
  const [activeStatus, setActiveStatus] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState<HomeStatus>("Active");
  const [update, setUpdate] = useState(false);

  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
  });

  const statusOptions: bookingStatusOption[] = [
    { label: "multi", isActive: activeStatus === 0 },
    { label: "semi-private", isActive: activeStatus === 1 },
    { label: "private", isActive: activeStatus === 2 },
  ];

  const handleStatusChange = (index: number): void => {
    setActiveStatus(index);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getRooms = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(
        `/rooms?roomType=${status}&roomStatus=${selectedStatus?.toLocaleLowerCase()}&page=${
          pagination?.currentPage ?? 1
        }`
      );

      if (data.success) {
        setRooms(data?.data?.rooms);
        setPagination(data?.data?.pagination);
        setState("ready");
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getRooms();
  }, [status, selectedStatus, update]);

  return (
    <div className="max-w-[90em] mx-auto py-6 px-[4em]">
      {state === "error" && <Toast {...toast} />}
      <div className="flex flex-wrap justify-between items-center gap-6 p-0">
        <h1 className="text-[32px] font-[400]">
          Hello, <span className="font-[600]">{user?.name}!</span>
        </h1>
      </div>
      <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
        <div>
          <p className="mt-2 text-[24px] font-[500] text-black pt-2">
            My Properties
          </p>
        </div>
        <button
          onClick={() => {
            navigate("/add-listing");
          }}
          className="gradient-color rounded-full text-white text-[14px] font-[600] px-4 py-3 transition cursor-pointer"
        >
          + Add Property
        </button>
      </div>
      <div className="flex justify-between">
        <StatusFilter
          statuses={statusOptions}
          setStatus={setStatus}
          onStatusChange={handleStatusChange}
        />
        <div className="mt-3">
          <HomeFilterDropDown
            selected={selectedStatus}
            setSelected={setSelectedStatus}
          />
        </div>
      </div>
      {state === "loading" ? (
        <HomeSkeleton />
      ) : (
        <div className="mt-10">
          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {rooms.map((room, index) => (
                <PropertyCard
                  key={index}
                  room={room}
                  dotBar={dotBar}
                  setUpdate={setUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 text-lg font-medium">
                No records found
              </p>
            </div>
          )}
        </div>
      )}
      <Pagination
        currentPage={pagination?.currentPage ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;
