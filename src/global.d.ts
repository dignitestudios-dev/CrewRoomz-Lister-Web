export {}; // makes this a module

declare global {
  type LoadState = "idle" | "loading" | "error" | "ready";

  interface LoginFormValues {
    email: string;
    password: string;
  }

  interface SignupFormValues {
    profile: File | null;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isChecked: boolean;
  }

  interface ForgotPasswordFormValues {
    email: string;
  }

  interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
  }

  interface Property {
    _id: number;
    name: string;
    image: string;
    author: string;
    address: string;
    rent: number;
    beds: string[];
  }

  // interface BedTypeStandard {
  //   type: "king" | "queen";
  //   dailyPrice: string;
  //   monthlyPrice: string;
  // }

  // interface BedTypeBunk {
  //   type: "bunk";
  //   topBed: {
  //     dailyPrice: string;
  //     monthlyPrice: string;
  //   };
  //   bottomBed: {
  //     dailyPrice: string;
  //     monthlyPrice: string;
  //   };
  // }

  // type BedType = BedTypeStandard | BedTypeBunk;

  interface FormValues {
    images: File[] | null;
    description: string;
    rulesFiles: File[] | null;
    // bedTypes: BedType[];
    sharedBath: string;
    privateBath: string;
    address: string;
    amenities: string[];
  }

  interface HeaderOption {
    label: string | JSX.Element;
    path: string;
  }
  type FilterOptions = {
    label: HomeFilter;
    isActive: boolean;
  };

  type HomeFilter = "multi" | "semi-private" | "private";
  type HomeStatus = "Active" | "Inactive";
  type SelectedStatus = "Daily" | "Monthly";

  type BunkType = "top" | "bottom";

  // For normal bed pricing
  interface Prices {
    dailyPrice: string;
    monthlyPrice: string;
  }

  // For bunk bed pricing (top + bottom)
  interface BunkPrices {
    top: Prices;
    bottom: Prices;
  }

  // A single bed entry
  interface Bed {
    bedType: string;
    prices: Prices;
    bunkPrices: BunkPrices;
  }

  // Entire reducer state
  interface State {
    beds: Bed[];
  }

  interface Message {
    text: string;
    time: string;
  }

  interface Chat {
    id: string;
    participants: Record<string, string>; // or string[] depending on your schema
    lastMessage?: string;
    user?: {
      uid: string;
      email: string;
      id: string;
      name: string;
      profilePicture?: string;
      role: string;
    };
  }

  interface User {
    id: number;
    name: string;
    initials: string;
    image: string; // or StaticImport if using Next.js images
  }
  type Sender = "me" | "them";

  interface BaseMessage {
    sender: Sender;
    time: string;
  }

  interface TextMessage extends BaseMessage {
    type: "text";
    text: string;
  }

  interface ImageMessage extends BaseMessage {
    type: "image";
    file: string;
  }

  interface FileMessage extends BaseMessage {
    type: "file";
    file: string;
    name: string;
  }

  type Message = TextMessage | ImageMessage | FileMessage;
  type Chats = Record<string, Message[]>;

  interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }

  interface PaginationState {
    currentPage: number;
    totalPages: number;
  }
  // export interface GeoLocation {
  //   type: "Point";
  //   coordinates: [number, number]; // [lng, lat]
  // }

  // export interface EditGeoLocation {
  //   lat: number;
  //   lng: number;
  //   type?: "Point";
  //   coordinates?: [number, number];
  // }

  // Address structure used across components
  export type LocationType = {
    lat: number;
    lng: number;
    type?: "Point";
    coordinates?: [number, number];
  };
  export interface Address {
    address: string;
    city: string;
    state: string;
    country?: string;
    zipCode?: string;
    location: LocationType;
  }
  export interface EditAddress {
    address: string;
    city: string;
    state: string;
    country?: string;
    zipCode?: string;
    location: LocationType;
  }
}
