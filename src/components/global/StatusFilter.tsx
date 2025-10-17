import React from "react";

export type bookingStatus = "private" | "multi" | "semi-private";

export type bookingStatusOption = {
  label: bookingStatus;
  isActive: boolean;
};

interface StatusIndicatorProps {
  statuses: bookingStatusOption[];
  onStatusChange: (index: number) => void;
  setStatus: React.Dispatch<React.SetStateAction<bookingStatus>>;
}
const StatusFilter = ({
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

export default StatusFilter;
