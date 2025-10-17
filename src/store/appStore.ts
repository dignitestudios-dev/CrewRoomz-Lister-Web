// store/useUserStore.ts
import { create } from "zustand";
import axios from "../axios";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  uid: string | number;
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
