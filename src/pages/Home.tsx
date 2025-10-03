import React, { useState } from "react";
import { useNavigate } from "react-router";
import { dotBar, homeOne, homeTwo } from "../assets/export.ts";
import { HomeFilterDropDown } from "../components/global/FilterDropDown.tsx";
import PropertyCard from "../components/properties/PropertyCard.tsx";

interface StatusIndicatorProps {
  statuses: StatusOption[];
  onStatusChange: (index: number) => void;
  setStatus: React.Dispatch<React.SetStateAction<HomeStatus>>;
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

const Home = () => {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState(0);
  const [status, setStatus] = useState<HomeStatus>("pending");
  console.log("🚀 ~ Home ~ status:", status);

  const statusOptions: StatusOption[] = [
    { label: "pending", isActive: activeStatus === 0 },
    { label: "approved", isActive: activeStatus === 1 },
    { label: "rejected", isActive: activeStatus === 2 },
  ];

  const [userData, setUserData] = useState<Property[]>([
    {
      _id: 1,
      name: "First Property",
      image: homeOne,
      author: "John Doe",
      rent: 1200,
      address: "New York, NY",
      beds: ["1 BHK", "2 BHK"],
    },
    {
      _id: 2,
      name: "Second Property",
      image: homeTwo,
      author: "Claman Joe",
      rent: 1500,
      address: "Los Angeles, CA",
      beds: ["1 BHK", "2 BHK"],
    },
  ]);

  const handleStatusChange = (index: number): void => {
    setActiveStatus(index);
  };
  return (
    <div className="max-w-[90em] mx-auto py-6 px-[4em]">
      <div className="flex flex-wrap justify-between items-center gap-6 p-0">
        <h1 className="text-[32px] font-[400]">
          Hello, <span className="font-[600]">Mike!</span>
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
            setUserData([]);
          }}
          className="gradient-color rounded-full text-white text-[14px] font-[600] px-4 py-3 transition cursor-pointer"
        >
          + Add Property
        </button>
      </div>
      <div className="flex justify-between">
        <StatusIndicator
          statuses={statusOptions}
          setStatus={setStatus}
          onStatusChange={handleStatusChange}
        />
        <div className="mt-3">
          <HomeFilterDropDown />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {userData.map((property, index) => (
          <PropertyCard key={index} property={property} dotBar={dotBar} />
        ))}
      </div>
    </div>
  );
};

export default Home;
