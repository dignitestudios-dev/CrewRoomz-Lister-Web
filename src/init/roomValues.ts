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
