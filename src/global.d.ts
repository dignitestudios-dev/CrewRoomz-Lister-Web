export {}; // makes this a module

declare global {
  interface LoginFormValues {
    email: string;
    password: string;
  }

  interface SignupFormValues {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
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
  type StatusOption = {
    label: HomeStatus;
    isActive: boolean;
  };

  type HomeStatus = "pending" | "approved" | "rejected";

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
  type Chats = Record<number, Message[]>;
}
