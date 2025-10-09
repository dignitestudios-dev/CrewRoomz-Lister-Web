import moment from "moment";

export const propertyValues: FormValues = {
  images: null,
  description: "",
  rulesFiles: null,

  sharedBath: "",
  privateBath: "",
  address: "",
  amenities: [],
};

export const changPasswordValues = {
  password: "",
  confirmPassword: "",
  newPassword: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong";
}

export const getDateFormat = (date: Date | string | number) => {
  return moment(date).format("MM-DD-YYYY");
};

type Prices = {
  dailyPrice: string;
  monthlyPrice: string;
};

type BunkType = "top" | "bottom";

type Bed = {
  bedType: string;
  prices: Prices;
  bunkPrices: Record<BunkType, Prices>;
};

type State = {
  beds: Bed[];
};

type Action =
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
  | { type: "REMOVE_BED"; index: number }
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
    case "SET_BED_TYPE": {
      const newBeds = [...state.beds];
      newBeds[action.index].bedType = action.payload;
      return { ...state, beds: newBeds };
    }

    case "SET_PRICE": {
      const { name, value } = action.payload;
      const newBeds = [...state.beds];
      newBeds[action.index].prices = {
        ...newBeds[action.index].prices,
        [name]: value,
      };
      return { ...state, beds: newBeds };
    }

    case "SET_BUNK_PRICE": {
      const { bunk, name, value } = action.payload;
      const newBeds = [...state.beds];
      newBeds[action.index].bunkPrices[bunk] = {
        ...newBeds[action.index].bunkPrices[bunk],
        [name]: value,
      };
      return { ...state, beds: newBeds };
    }

    case "ADD_BED": {
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
    }

    case "REMOVE_BED": {
      const updatedBeds = state.beds.filter((_, i) => i !== action.index);
      return { ...state, beds: updatedBeds };
    }

    case "SET_BEDS": {
      // For edit scenario — replace all beds with prefilled data
      return { ...state, beds: action.payload };
    }

    default:
      return state;
  }
}
