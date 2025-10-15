// src/reducers/bedReducer.ts

export type BunkType = "top" | "bottom";

export interface Prices {
  dailyPrice: string;
  monthlyPrice: string;
}

export interface Bed {
  bedType: string;
  prices: Prices;
  bunkPrices: Record<BunkType, Prices>;
}

export interface State {
  beds: Bed[];
}

export type Action =
  | { type: "ADD_BED" }
  | { type: "REMOVE_BED"; index: number }
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
  | { type: "SET_BEDS"; payload: Bed[] };

export const initialState: State = {
  beds: [
    {
      bedType: "",
      prices: { dailyPrice: "", monthlyPrice: "" },
      bunkPrices: {
        top: { dailyPrice: "", monthlyPrice: "" },
        bottom: { dailyPrice: "", monthlyPrice: "" },
      },
    },
  ],
};

export function bedReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_BED":
      return {
        ...state,
        beds: [
          ...state.beds,
          {
            bedType: "",
            prices: { dailyPrice: "", monthlyPrice: "" },
            bunkPrices: {
              top: { dailyPrice: "", monthlyPrice: "" },
              bottom: { dailyPrice: "", monthlyPrice: "" },
            },
          },
        ],
      };

    case "REMOVE_BED":
      return {
        ...state,
        beds: state.beds.filter((_, i) => i !== action.index),
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

    case "SET_BEDS": {
      // For edit scenario — replace all beds with prefilled data
      return { ...state, beds: action.payload };
    }

    default:
      return state;
  }
}

//For Editing

export const editInitialState: State = {
  beds: [
    {
      bedType: "",
      prices: { dailyPrice: "", monthlyPrice: "" },
      bunkPrices: {
        top: { dailyPrice: "", monthlyPrice: "" },
        bottom: { dailyPrice: "", monthlyPrice: "" },
      },
    },
  ],
};

export function editBedReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_BED":
      return {
        ...state,
        beds: [
          ...state.beds,
          {
            bedType: "",
            prices: { dailyPrice: "", monthlyPrice: "" },
            bunkPrices: {
              top: { dailyPrice: "", monthlyPrice: "" },
              bottom: { dailyPrice: "", monthlyPrice: "" },
            },
          },
        ],
      };

    case "REMOVE_BED":
      return {
        ...state,
        beds: state.beds.filter((_, i) => i !== action.index),
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

    case "SET_BEDS": {
      // For edit scenario — replace all beds with prefilled data
      return { ...state, beds: action.payload };
    }

    default:
      return state;
  }
}

interface BedPrice {
  dailyPrice: string | number;
  monthlyPrice: string | number;
}

interface BunkPrices {
  top: BedPrice;
  bottom: BedPrice;
}

interface BunkIds {
  top: string;
  bottom: string;
}

interface BedData {
  _id?: string;
  bedType: string;
  prices: BedPrice;
  bunkPrices?: BunkPrices;
  bunkIds?: BunkIds;
  isFromBackend?: boolean;
}
interface ExistingBedDetails {
  _id: string;
  price: number;
  monthlyPrice: number;
}

interface NewBedDetails {
  type: string;
  price?: number;
  monthlyPrice?: number;
  topPrice?: number;
  topMonthlyPrice?: number;
  bottomPrice?: number;
  bottomMonthlyPrice?: number;
}

export const prepareBedDataForSubmit = (
  bedData: BedData[],
  formData: FormData
) => {
  const bedDetails: ExistingBedDetails[] = [];
  const bedDetailsToAdd: NewBedDetails[] = [];

  bedData.forEach((bed) => {
    // Normalize numeric fields
    const dailyPrice = Number(bed.prices?.dailyPrice || 0);
    const monthlyPrice = Number(bed.prices?.monthlyPrice || 0);

    // ✅ CASE 1: Existing bed with `_id`
    if (bed._id) {
      bedDetails.push({
        _id: bed._id,
        price: dailyPrice,
        monthlyPrice,
      });
    }

    // ✅ CASE 2: Existing bunk bed with `bunkIds`
    else if (bed.bunkIds && bed.bunkPrices) {
      const topDaily = Number(bed.bunkPrices.top.dailyPrice || 0);
      const topMonthly = Number(bed.bunkPrices.top.monthlyPrice || 0);
      const bottomDaily = Number(bed.bunkPrices.bottom.dailyPrice || 0);
      const bottomMonthly = Number(bed.bunkPrices.bottom.monthlyPrice || 0);

      if (bed.bunkIds.top) {
        bedDetails.push({
          _id: bed.bunkIds.top,
          price: topDaily,
          monthlyPrice: topMonthly,
        });
      }

      if (bed.bunkIds.bottom) {
        bedDetails.push({
          _id: bed.bunkIds.bottom,
          price: bottomDaily,
          monthlyPrice: bottomMonthly,
        });
      }
    }

    // ✅ CASE 3: New bed (no IDs → add new)
    else {
      // Bunk beds added newly
      if (bed.bedType.includes("bunk") && bed.bunkPrices) {
        bedDetailsToAdd.push({
          type: bed.bedType,
          topPrice: Number(bed.bunkPrices.top.dailyPrice || 0),
          topMonthlyPrice: Number(bed.bunkPrices.top.monthlyPrice || 0),
          bottomPrice: Number(bed.bunkPrices.bottom.dailyPrice || 0),
          bottomMonthlyPrice: Number(bed.bunkPrices.bottom.monthlyPrice || 0),
        });
      }
      // Normal single bed
      else {
        bedDetailsToAdd.push({
          type: bed.bedType,
          price: dailyPrice,
          monthlyPrice,
        });
      }
    }
  });

  // ✅ Append both lists to FormData
  if (bedDetails.length > 0) {
    formData.append("bedDetails", JSON.stringify(bedDetails));
  }

  if (bedDetailsToAdd.length > 0) {
    formData.append("bedDetailsToAdd", JSON.stringify(bedDetailsToAdd));
  }

  return formData;
};
