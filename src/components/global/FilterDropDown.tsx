import { useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";

interface StatusIndicatorProps {
  selected: HomeStatus;
  setSelected: React.Dispatch<React.SetStateAction<HomeStatus>>;
}

interface SelectedStatusProps {
  selected: SelectedStatus;
  setSelected: React.Dispatch<React.SetStateAction<SelectedStatus>>;
}

export const HomeFilterDropDown = ({
  selected,
  setSelected,
}: StatusIndicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: HomeStatus[] = ["All", "Active", "Inactive"];

  const handleSelect = (option: HomeStatus) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-40">
      {/* Selected Option */}
      <div
        className="flex items-center justify-between rounded-full bg-white px-6 py-2 cursor-pointer shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
        <BiSolidDownArrow
          size={18}
          className={`transition-transform duration-200 text-[#18181899] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white rounded-xl  z-10">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-6 py-2 cursor-pointer hover:bg-gray-100 rounded-lg ${
                selected === option ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BookingFilterDropDown = ({
  selected,
  setSelected,
}: SelectedStatusProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: SelectedStatus[] = ["Daily", "Monthly"];

  const handleSelect = (option: SelectedStatus) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="">
      {/* Selected Option */}
      <div
        className="flex items-center justify-center rounded-full gradient-image gap-4 py-2 px-6 text-[15px] cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
        <IoFilter
          size={18}
          className={`transition-transform duration-200 text-[#36C0EF] ${
            isOpen ? "" : ""
          }`}
        />
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute mt-2 w-40 bg-white rounded-xl shadow-md z-10">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-6 py-2 cursor-pointer hover:bg-gray-100 rounded-lg ${
                selected === option ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
