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
}
