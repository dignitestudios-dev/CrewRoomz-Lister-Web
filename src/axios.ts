import axios from "axios";
import Cookies from "js-cookie";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { ErrorToast } from "./components/global/Toaster";

const baseUrl = "https://dev.crewroomz.com";

async function getDeviceFingerprint() {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (err) {
    console.error("Error generating fingerprint:", err);
    return "unknown-device";
  }
}

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 60000, // 60 seconds
});

// 🧠 Request interceptor
instance.interceptors.request.use(
  async (request) => {
    if (!navigator.onLine) {
      ErrorToast(
        "No internet connection. Please check your network and try again."
      );
      return Promise.reject(new Error("No internet connection"));
    }

    const token = Cookies.get("token");
    const visitorId = await getDeviceFingerprint();

    request.headers.set("Accept", "application/json, text/plain, */*");
    request.headers.set("devicemodel", navigator.userAgent);
    request.headers.set("deviceuniqueid", visitorId);
    if (token) request.headers.set("Authorization", `Bearer ${token}`);

    return request;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      // Slow internet or request timeout
      ErrorToast("Your internet connection is slow. Please try again.");
    }

    if (error.response && error.response.status === 401) {
      // Unauthorized error
      Cookies.remove("token");
      Cookies.remove("user");
      ErrorToast("Session expired. Please relogin");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;
