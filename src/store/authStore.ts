import { create } from "zustand";
import Cookies from "js-cookie";

type UpdateUserPayload = {
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
};

type User = Record<string, unknown>;

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user?: User, remember?: boolean) => void;
  clearAuth: () => void;
  updateUser: (user?: UpdateUserPayload, remember?: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get(TOKEN_KEY) || null,
  user: (() => {
    const v = Cookies.get(USER_KEY);
    return v ? JSON.parse(v) : null;
  })(),

  setAuth: (token, user = undefined, remember = true) => {
    set({ token, user });
    const opts = remember ? { expires: 7 } : undefined;
    Cookies.set(TOKEN_KEY, token, opts);
    Cookies.set(USER_KEY, JSON.stringify(user || {}), opts);
  },

  updateUser: (user = undefined, remember = true) => {
    console.log("🚀 ~ user:", user);
    set((state) => ({ ...state, user }));
    const opts = remember ? { expires: 7 } : undefined;
    Cookies.set(USER_KEY, JSON.stringify(user || {}), opts);
  },

  clearAuth: () => {
    set({ token: null, user: null });
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
}));

export default useAuthStore;
