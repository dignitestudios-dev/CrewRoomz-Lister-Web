
import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

type User = Record<string, unknown>;

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user?: User, remember?: boolean) => void;
  clearAuth: () => void;
  validateToken: () => Promise<boolean>;
}

const useAuthStore = create<AuthState>((set, get) => ({
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
  clearAuth: () => {
    set({ token: null, user: null });
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
  validateToken: async () => {
    const token = get().token;
    if (!token) return false;
    try {
      // endpoint should validate token server-side (adjust path if needed)
      await axios.get("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err) {
      console.log("🚀 ~ err:", err)
      get().clearAuth();
      return false;
    }
  },
}));

export default useAuthStore;