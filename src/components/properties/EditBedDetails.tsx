// src/components/EditBedDetails.tsx
import React, { useReducer, useEffect } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { binIcon } from "../../assets/export";

// ============================================
// TYPES
// ============================================
interface BedTypeOption {
  value: string;
  label: string;
}

interface BackendBedDetail {
  type: string;
  price: number;
  monthlyPrice: number;
  _id: string;
}

interface Prices {
  dailyPrice: string;
  monthlyPrice: string;
}

type BunkType = "top" | "bottom";

interface Bed {
  bedType: string;
  _id?: string;
  isFromBackend: boolean;
  bunkIds?: {
    top?: string;
    bottom?: string;
  };
  prices: Prices;
  bunkPrices: {
    top: Prices;
    bottom: Prices;
  };
}

interface EditBedState {
  beds: Bed[];
  deletedBedIds: string[];
}

type EditBedAction =
  | { type: "INITIALIZE_BEDS"; payload: Bed[] }
  | { type: "SET_BED_TYPE"; index: number; payload: string }
  | {
      type: "SET_PRICE";
      index: number;
      payload: { name: keyof Prices; value: string };
    }
  | {
      type: "SET_BUNK_PRICE";
      index: number;
      payload: { bunk: BunkType; name: keyof Prices; value: string };
    }
  | { type: "ADD_BED" }
  | { type: "REMOVE_BED"; index: number };

interface EditBedDetailsProps {
  roomType: string;
  bedTypeOptions: BedTypeOption[];
  bedDetails: BackendBedDetail[];
  onBedDataChange?: (beds: Bed[], deletedIds: string[]) => void;
}

// ============================================
// UTILITIES
// ============================================
const transformBackendToState = (backendBeds: BackendBedDetail[]): Bed[] => {
  const bedMap = new Map<string, Bed>();

  backendBeds.forEach((bed) => {
    const isBunkBed = bed.type.includes("-top") || bed.type.includes("-bottom");

    if (isBunkBed) {
      const baseType = bed.type.replace("-top", "").replace("-bottom", "");
      const bunkPosition = bed.type.includes("-top") ? "top" : "bottom";

      if (!bedMap.has(baseType)) {
        bedMap.set(baseType, {
          bedType: baseType,
          isFromBackend: true,
          prices: { dailyPrice: "", monthlyPrice: "" },
          bunkPrices: {
            top: { dailyPrice: "", monthlyPrice: "" },
            bottom: { dailyPrice: "", monthlyPrice: "" },
          },
          bunkIds: {},
        });
      }

      const existingBed = bedMap.get(baseType)!;
      existingBed.bunkPrices[bunkPosition] = {
        dailyPrice: bed.price.toString(),
        monthlyPrice: bed.monthlyPrice.toString(),
      };
      existingBed.bunkIds![bunkPosition] = bed._id;
    } else {
      bedMap.set(bed._id, {
        bedType: bed.type,
        _id: bed._id,
        isFromBackend: true,
        prices: {
          dailyPrice: bed.price.toString(),
          monthlyPrice: bed.monthlyPrice.toString(),
        },
        bunkPrices: {
          top: { dailyPrice: "", monthlyPrice: "" },
          bottom: { dailyPrice: "", monthlyPrice: "" },
        },
      });
    }
  });

  return Array.from(bedMap.values());
};

// export const transformStateToBackend = (beds: Bed[]) => {
//   const backendBeds: any[] = [];

//   beds.forEach((bed) => {
//     const isBunkBed = bed.bedType.startsWith("bunk-");

//     if (isBunkBed && bed.bedType !== "") {
//       const topPrice = parseFloat(bed.bunkPrices.top.dailyPrice) || 0;
//       const topMonthlyPrice = parseFloat(bed.bunkPrices.top.monthlyPrice) || 0;
//       const bottomPrice = parseFloat(bed.bunkPrices.bottom.dailyPrice) || 0;
//       const bottomMonthlyPrice = parseFloat(bed.bunkPrices.bottom.monthlyPrice) || 0;

//       if (topPrice > 0 || topMonthlyPrice > 0) {
//         backendBeds.push({
//           type: `${bed.bedType}-top`,
//           price: topPrice,
//           monthlyPrice: topMonthlyPrice,
//           ...(bed.bunkIds?.top && { _id: bed.bunkIds.top }),
//         });
//       }

//       if (bottomPrice > 0 || bottomMonthlyPrice > 0) {
//         backendBeds.push({
//           type: `${bed.bedType}-bottom`,
//           price: bottomPrice,
//           monthlyPrice: bottomMonthlyPrice,
//           ...(bed.bunkIds?.bottom && { _id: bed.bunkIds.bottom }),
//         });
//       }
//     } else if (bed.bedType !== "") {
//       const dailyPrice = parseFloat(bed.prices.dailyPrice) || 0;
//       const monthlyPrice = parseFloat(bed.prices.monthlyPrice) || 0;

//       if (dailyPrice > 0 || monthlyPrice > 0) {
//         backendBeds.push({
//           type: bed.bedType,
//           price: dailyPrice,
//           monthlyPrice: monthlyPrice,
//           ...(bed._id && bed.isFromBackend && { _id: bed._id }),
//         });
//       }
//     }
//   });

//   return backendBeds;
// };

// ============================================
// REDUCER
// ============================================
const editBedReducer = (
  state: EditBedState,
  action: EditBedAction
): EditBedState => {
  switch (action.type) {
    case "INITIALIZE_BEDS":
      return {
        ...state,
        beds: action.payload,
      };

    case "SET_BED_TYPE":
      return {
        ...state,
        beds: state.beds.map((bed, i) =>
          i === action.index ? { ...bed, bedType: action.payload } : bed
        ),
      };

    case "SET_PRICE":
      return {
        ...state,
        beds: state.beds.map((bed, i) =>
          i === action.index
            ? {
                ...bed,
                prices: {
                  ...bed.prices,
                  [action.payload.name]: action.payload.value,
                },
              }
            : bed
        ),
      };

    case "SET_BUNK_PRICE":
      return {
        ...state,
        beds: state.beds.map((bed, i) =>
          i === action.index
            ? {
                ...bed,
                bunkPrices: {
                  ...bed.bunkPrices,
                  [action.payload.bunk]: {
                    ...bed.bunkPrices[action.payload.bunk],
                    [action.payload.name]: action.payload.value,
                  },
                },
              }
            : bed
        ),
      };

    case "ADD_BED":
      return {
        ...state,
        beds: [
          ...state.beds,
          {
            bedType: "",
            isFromBackend: false,
            prices: { dailyPrice: "", monthlyPrice: "" },
            bunkPrices: {
              top: { dailyPrice: "", monthlyPrice: "" },
              bottom: { dailyPrice: "", monthlyPrice: "" },
            },
          },
        ],
      };

    case "REMOVE_BED": {
      const deletedBed = state.beds[action.index];
      const deletedIds: string[] = [];

      if (deletedBed.isFromBackend) {
        if (deletedBed._id) deletedIds.push(deletedBed._id);
        if (deletedBed.bunkIds?.top) deletedIds.push(deletedBed.bunkIds.top);
        if (deletedBed.bunkIds?.bottom)
          deletedIds.push(deletedBed.bunkIds.bottom);
      }

      return {
        ...state,
        beds: state.beds.filter((_, i) => i !== action.index),
        deletedBedIds: [...state.deletedBedIds, ...deletedIds],
      };
    }

    default:
      return state;
  }
};

// ============================================
// COMPONENT
// ============================================
const EditBedDetails: React.FC<EditBedDetailsProps> = ({
  roomType,
  bedTypeOptions,
  bedDetails,
  onBedDataChange,
}) => {
  const initialState: EditBedState = {
    beds: [],
    deletedBedIds: [],
  };

  const [state, dispatch] = useReducer(editBedReducer, initialState);

  // Initialize beds from backend data
  useEffect(() => {
    if (bedDetails && bedDetails.length > 0) {
      const transformedBeds = transformBackendToState(bedDetails);
      dispatch({ type: "INITIALIZE_BEDS", payload: transformedBeds });
    }
  }, [bedDetails]);

  // Notify parent component of changes
  useEffect(() => {
    if (onBedDataChange && state.beds.length > 0) {
      onBedDataChange(state.beds, state.deletedBedIds);
    }
  }, [state.beds, state.deletedBedIds, onBedDataChange]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleBedTypeChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const bed = state.beds[index];

    // Prevent changing bed type if it's from backend
    if (bed.isFromBackend) {
      alert(
        "Cannot change bed type for existing beds. Please delete and add a new bed instead."
      );
      return;
    }

    dispatch({ type: "SET_BED_TYPE", index, payload: e.target.value });
  };

  const handlePriceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;
    const isValid = /^\d+$/.test(rawValue);

    if (!isValid && rawValue !== "") return;
    dispatch({
      type: "SET_PRICE",
      index,
      payload: { name: e.target.name as keyof Prices, value: rawValue },
    });
  };

  const handleBunkPriceChange = (
    index: number,
    bunk: BunkType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;
    const isValid = /^\d+$/.test(rawValue);

    if (!isValid && rawValue !== "") return;

    dispatch({
      type: "SET_BUNK_PRICE",
      index,
      payload: {
        bunk,
        name: e.target.name as keyof Prices,
        value: rawValue,
      },
    });
  };

  const handleRemoveBed = (index: number) => {
    const bed = state.beds[index];

    if (bed.isFromBackend) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this bed? This action cannot be undone."
      );
      if (!confirmDelete) return;
    }

    dispatch({ type: "REMOVE_BED", index });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="w-full">
      {/* <label className="text-[16px] font-[500] border-t-2 border-t-[#E3E3E3] pt-4">
        Bed Details
      </label> */}

      <div className="bg-[#ffffff] rounded-lg pt-2 pb-4 px-4 text-center flex flex-col items-start space-y-2">
        <p className="text-[#18181899] text-[14px] font-[400]">
          Choose daily or monthly booking for bed.
        </p>

        <div className="flex flex-col items-start w-full gap-3">
          {state.beds.map((bed, index) => (
            <div key={bed._id || `bed-${index}`} className="relative w-full">
              <div
                className={`flex items-center gap-3 w-[750px] relative ${
                  index > 0 ? "border-t-[1px] border-t-[#E3E3E3] pt-3" : ""
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
                    disabled={bed.isFromBackend}
                    className={`w-full py-4.5 pl-3 pr-5 text-[14px] text-[#18181899] bg-[#29ABE21F] rounded-md ${
                      bed.isFromBackend ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select Bed Type</option>
                    {bedTypeOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {/* {bed.isFromBackend && (
                    <p className="text-[11px] text-[#FF6B6B] mt-1">
                      Type cannot be changed in edit mode
                    </p>
                  )} */}
                </div>

                {/* --- Remove Button --- */}
                {state.beds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBed(index)}
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
                            inputMode="numeric"
                            pattern="\d*"
                            value={bed.prices.dailyPrice}
                            onChange={(e) => handlePriceChange(index, e)}
                            className="w-full bg-transparent outline-0"
                            placeholder="00"
                            maxLength={4}
                          />
                        </div>
                        <div className="w-full py-1 pl-3 pr-5 bg-[#29ABE21F] rounded-md">
                          <label className="block mb-1 text-[13px] font-[500] text-start">
                            Monthly
                          </label>
                          <input
                            name="monthlyPrice"
                            inputMode="numeric"
                            pattern="\d*"
                            value={bed.prices.monthlyPrice}
                            onChange={(e) => handlePriceChange(index, e)}
                            className="w-full bg-transparent outline-0"
                            placeholder="00"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* --- Bunk Beds --- */}
              {bed.bedType &&
                !["twin", "twin-xl", "full"].includes(bed.bedType) && (
                  <div className="flex flex-col gap-4 mt-3">
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
                              value={
                                bed.bunkPrices[bunk as BunkType].dailyPrice
                              }
                              onChange={(e) =>
                                handleBunkPriceChange(
                                  index,
                                  bunk as BunkType,
                                  e
                                )
                              }
                              maxLength={4}
                              inputMode="numeric"
                              pattern="\d*"
                              className="w-full bg-transparent outline-0"
                              placeholder="00"
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
                                handleBunkPriceChange(
                                  index,
                                  bunk as BunkType,
                                  e
                                )
                              }
                              maxLength={4}
                              inputMode="numeric"
                              pattern="\d*"
                              className="w-full bg-transparent outline-0"
                              placeholder="00"
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
          {roomType === "multi" && (
            <button
              type="button"
              disabled={state.beds.length >= 4}
              onClick={() => dispatch({ type: "ADD_BED" })}
              className={`flex items-center gap-2 pt-2 ${
                state.beds.length >= 4
                  ? "opacity-50 cursor-auto"
                  : "cursor-pointer"
              }`}
            >
              <HiOutlinePlus className="text-[18px] text-[#36C0EF]" />
              <p className="text-[14px] gradient-text font-[500]">
                Add More Beds
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBedDetails;
