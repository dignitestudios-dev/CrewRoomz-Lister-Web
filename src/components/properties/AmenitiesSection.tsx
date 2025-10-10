import React from "react";
import { AMENITY_GROUPS } from "../../statics/amenities";

interface AmenitiesSectionProps {
  values: {
    amenities: string[];
  };
  toggleAmenity: (item: string) => void;
  ticked: string; // checked icon path
  untick: string; // unchecked icon path
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  values,
  toggleAmenity,
  ticked,
  untick,
}) => {
  return (
    <div className="pt-4 border-t-2 border-t-[#E3E3E3]">
      <p className="text-[20px] font-semibold">Amenities</p>
      <p className="text-[#18181899] text-[14px] font-[400]">
        You can select multiple options for amenities:
      </p>

      {AMENITY_GROUPS.map((group) => (
        <div key={group.title} className="mb-6">
          <p className="text-[16px] font-[500] py-3">{group.title}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {group.items.map((item, index) => {
              const isChecked = values.amenities.includes(item);

              return (
                <div key={index} className="flex items-center gap-2 py-1">
                  <label className="flex items-center cursor-pointer select-none gap-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAmenity(item)}
                      className="hidden"
                    />
                    <img
                      src={isChecked ? ticked : untick}
                      alt={isChecked ? "Checked" : "Unchecked"}
                      className="w-5 h-5 transition-transform duration-200 ease-in-out"
                    />
                    <span className="text-[14px]">{item}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AmenitiesSection;
