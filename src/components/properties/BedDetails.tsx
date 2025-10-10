// src/components/BedDetails.tsx
import React, { useReducer } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { binIcon } from "../../assets/export";
import { bedReducer, initialState } from "../../init/roomValues";

interface BedTypeOption {
  value: string;
  label: string;
}

interface BedDetailsProps {
  type: string;
  bedTypeOptions: BedTypeOption[];
}

const BedDetails: React.FC<BedDetailsProps> = ({ type, bedTypeOptions }) => {
  const [state, dispatch] = useReducer(bedReducer, initialState);

  // --- Handlers ---
  const handleBedTypeChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch({ type: "SET_BED_TYPE", index, payload: e.target.value });
  };

  const handlePriceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "SET_PRICE",
      index,
      payload: { name: e.target.name as keyof Prices, value: e.target.value },
    });
  };

  const handleBunkPriceChange = (
    index: number,
    bunk: BunkType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "SET_BUNK_PRICE",
      index,
      payload: {
        bunk,
        name: e.target.name as keyof Prices,
        value: e.target.value,
      },
    });
  };

  // --- JSX ---
  return (
    <div className="w-full">
      <label className="text-[16px] font-[500] border-t-2 border-t-[#E3E3E3] pt-4">
        Bed Details
      </label>

      <div className="bg-[#ffffff] rounded-lg pt-2 pb-4 px-4 text-center flex flex-col items-start space-y-2">
        <p className="text-[#18181899] text-[14px] font-[400]">
          Choose daily or monthly booking for bed.
        </p>

        <div className="flex flex-col items-start w-full gap-3">
          {state.beds.map((bed, index) => (
            <div key={index} className="relative">
              <div
                className={`flex items-center gap-3 w-[750px] ${
                  index % 2 !== 0
                    ? "border-t-[1px] border-t-[#E3E3E3] pt-3"
                    : ""
                }`}
              >
                {/* --- Bed Type --- */}
                <div className="w-[310px] flex flex-col items-start">
                  <label className="block mb-1 text-[13px] font-[500]">
                    Bed Type
                  </label>
                  <select
                    value={bed.bedType}
                    onChange={(e) => handleBedTypeChange(index, e)}
                    className="w-full py-4.5 pl-3 pr-5 text-[14px] text-[#18181899] bg-[#29ABE21F] rounded-md"
                  >
                    <option value="">Select Bed Type</option>
                    {bedTypeOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- Remove Button --- */}
                {state.beds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_BED", index })}
                    className="ml-auto text-red-500 text-sm font-medium hover:underline absolute top-0 right-0"
                  >
                    <img
                      src={binIcon}
                      className="h-7 w-7 p-1 hover:p-1.5 hover:bg-red-100 hover:rounded-4xl"
                      alt="delete"
                    />
                  </button>
                )}

                {/* --- Twin / Full Beds --- */}
                {bed.bedType &&
                  ["twin", "twin-xl", "full"].includes(bed.bedType) && (
                    <div>
                      <label className="block mb-1 text-[13px] font-[500] text-start">
                        Price
                      </label>
                      <div className="w-[310px] flex items-start gap-2">
                        <div className="w-full py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Daily
                          </label>
                          <input
                            name="dailyPrice"
                            value={bed.prices.dailyPrice}
                            onChange={(e) => handlePriceChange(index, e)}
                            className="w-full bg-transparent"
                            placeholder="e.g. 50"
                          />
                        </div>
                        <div className="w-full py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Monthly
                          </label>
                          <input
                            name="monthlyPrice"
                            value={bed.prices.monthlyPrice}
                            onChange={(e) => handlePriceChange(index, e)}
                            className="w-full bg-transparent"
                            placeholder="e.g. 1000"
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* --- Bunk Beds --- */}
              {!["twin", "twin-xl", "full"].includes(bed.bedType) && (
                <div className="flex flex-col gap-4">
                  {["top", "bottom"].map((bunk) => (
                    <div key={bunk}>
                      <label className="block mb-1 text-[13px] font-[500] text-start">
                        {bunk === "top" ? "Top Bed" : "Bottom Bed"}
                      </label>
                      <div className="w-full flex items-start gap-2">
                        <div className="w-[153px] py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Daily
                          </label>
                          <input
                            name="dailyPrice"
                            value={bed.bunkPrices[bunk as BunkType].dailyPrice}
                            onChange={(e) =>
                              handleBunkPriceChange(index, bunk as BunkType, e)
                            }
                            className="w-full bg-transparent text-[16px] text-[#181818]"
                            placeholder="e.g. 50"
                          />
                        </div>
                        <div className="w-[153px] py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Monthly
                          </label>
                          <input
                            name="monthlyPrice"
                            value={
                              bed.bunkPrices[bunk as BunkType].monthlyPrice
                            }
                            onChange={(e) =>
                              handleBunkPriceChange(index, bunk as BunkType, e)
                            }
                            className="w-full bg-transparent text-[16px] text-[#181818]"
                            placeholder="e.g. 1000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* --- Add More --- */}
          {type === "multi" && (
            <button
              type="button"
              onClick={() => dispatch({ type: "ADD_BED" })}
              className="flex items-center gap-2 pt-2 cursor-pointer"
            >
              <HiOutlinePlus className="text-[18px] text-[#36C0EF]" />
              <p className="text-[14px] gradient-text font-[500]">
                Add More Bed
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BedDetails;
