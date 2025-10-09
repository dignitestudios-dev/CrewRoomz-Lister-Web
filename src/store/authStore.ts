import { create } from "zustand";
import Cookies from "js-cookie";

type User = Record<string, unknown>;

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user?: User, remember?: boolean) => void;
  clearAuth: () => void;
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

  clearAuth: () => {
    set({ token: null, user: null });
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
}));

export default useAuthStore;
