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

interface FilterIndicatorProps {
  filters: FilterOptions[];
  onFilterChange: (index: number) => void;
  setFilter: React.Dispatch<React.SetStateAction<HomeFilter>>;
}

const FilterIndicator = ({
  filters,
  onFilterChange,
  setFilter,
}: FilterIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-[450px] px-3 h-[42px] bg-white rounded-full shadow-lite mt-6">
      {filters?.map((filter, index) => (
        <button
          key={index}
          onClick={() => {
            setFilter(filter?.label);
            onFilterChange?.(index);
          }}
          className={`px-10 h-[34px] rounded-full text-[14px] transition-all duration-200 ease-in-out capitalize ${
            filter.isActive
              ? "gradient-color text-white shadow-md font-[700]"
              : "text-[#181818] hover:text-gray-800 font-[400] hover:bg-gray-50"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

const Home = () => {
  const { user } = useAppStore();

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(0);
  const [filter, setFilter] = useState<HomeFilter>("multi");
  const [selectedStatus, setSelectedStatus] = useState<HomeStatus>("Active");
  const [update, setUpdate] = useState(false);

  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
  });

  const filterOptions: FilterOptions[] = [
    { label: "multi", isActive: activeFilter === 0 },
    { label: "semi-private", isActive: activeFilter === 1 },
    { label: "private", isActive: activeFilter === 2 },
  ];

  const handleFilterChange = (index: number): void => {
    setActiveFilter(index);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const getRooms = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(
        `/rooms?roomType=${filter}&roomStatus=${selectedStatus?.toLocaleLowerCase()}&page=${
          pagination?.currentPage ?? 1
        }`
      );
      console.log("🚀 ~ getRooms ~ data:", data);
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
  }, [filter, selectedStatus, update]);

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
        <FilterIndicator
          filters={filterOptions}
          setFilter={setFilter}
          onFilterChange={handleFilterChange}
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
