// store/useUserStore.ts
import { create } from "zustand";
import axios from "../axios";
interface User {
  location: {
    type: string;
    coordinates: [number, number];
  };
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  zipCode: number;
  uid: string;
  provider: string;
  identityStatus: string;
  stripeProfileStatus: string;
  stripeCustomerId: string;
  stripeBankId: string | null;
  isSubscriptionPaid: boolean;
  veriffSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AppStore {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User> | FormData) => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  loading: false,

  // ✅ Fetch user profile
  fetchUser: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/user/myProfile");
      set({ user: data?.data, loading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ loading: false });
    }
  },

  updateUser: async (data) => {
    try {
      set({ loading: true });
      const isFormData = data instanceof FormData;

      const response = await axios.put("/user/updateProfile", data, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      });

      // Update Zustand state instantly
      set({ user: response.data?.result });
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      set({ loading: false }); // ✅ stop loader
    }
  },

  // ✅ Manually set user (useful for login/logout)
  setUser: (user: User) => set({ user }),
}));
