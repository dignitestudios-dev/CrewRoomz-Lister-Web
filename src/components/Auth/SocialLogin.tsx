import React, { useState } from "react";
import { googleIcon } from "../../assets/export";
import { FaApple } from "react-icons/fa";
import { auth, googleProvider, appleProvider } from "../../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router";
import { FiLoader } from "react-icons/fi";
import axios from "../../axios";
import { ErrorToast } from "../../components/global/Toaster";

const SocialLogin: React.FC = () => {
  const navigate = useNavigate();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [appleLoading, setAppleLoading] = useState<boolean>(false);
  // const [idToken, setIdToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  console.log("🚀 ~ SocialLogin ~ error:", error);

  interface SocialLoginResponse {
    success: boolean;
    data?: {
      token?: string;
    };
    message?: string;
  }

  const handleAppleLogin = async (): Promise<void> => {
    try {
      setAppleLoading(true);
      const result = (await signInWithPopup(
        auth,
        appleProvider
      )) as import("firebase/auth").UserCredential & {
        _tokenResponse?: { idToken?: string };
      };

      if (result?.user) {
        const token = result?._tokenResponse?.idToken;
        // const email = result?.user?.email;

        const response = await axios.post<SocialLoginResponse>(
          `auth/dispensary-social-signup`,
          { idToken: token, role: "lister" }
        );

        if (response.data.success && response.data.data?.token) {
          sessionStorage.setItem("token", response.data.data.token);
          navigate("/userinfo");
        } else {
          console.error(
            "Login failed:",
            response?.data?.message || "Unknown error"
          );
          ErrorToast(
            response?.data?.message || "Login failed. Please try again."
          );
        }
      }
    } catch (err: unknown) {
      console.error("Apple login error:", err);
      setError("Cannot open Apple signin modal.");
    } finally {
      setAppleLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setGoogleLoading(true);
      const result = (await signInWithPopup(
        auth,
        googleProvider
      )) as import("firebase/auth").UserCredential & {
        _tokenResponse?: { idToken?: string };
      };

      if (result?.user) {
        const token = await result.user.getIdToken();
        // const email = result.user.email;

        const response = await axios.post<SocialLoginResponse>(
          `auth/dispensary-social-signup`,
          { idToken: token, role: "lister" }
        );

        if (response.data.success && response.data.data?.token) {
          sessionStorage.setItem("token", response.data.data.token);
          navigate("/userinfo");
        } else {
          console.error(
            "Login failed:",
            response?.data?.message || "Unknown error"
          );
          ErrorToast(
            response?.data?.message || "Login failed. Please try again."
          );
        }
      } else {
        throw new Error("Failed to retrieve token from Google login.");
      }
    } catch (err: unknown) {
      console.error("Google login error:", err);
      setError("Cannot open Google signin modal.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="md:flex md:justify-center w-[60%] py-2 mb-4">
      {/* ---- Google Login Button ---- */}
      <div
        onClick={() => handleGoogleLogin()}
        className="flex justify-between items-center h-[50px] field-shadow bg-[#FFFFFF] text-black font-medium text-[14px]
       text-center md:w-[400px] md:px-4 py-2.5 mt-2 md:mx-2 rounded-2xl cursor-pointer"
      >
        <div>
          <img
            className="md:w-[56px] w-[48px] pl-4"
            alt="google"
            src={googleIcon}
          />
        </div>
        <div className="w-full"> Google</div>
        {googleLoading && (
          <FiLoader className="text-[#1A293D] text-[32px] animate-spin me-2" />
        )}
      </div>

      {/* ---- Apple Login Button ---- */}
      <div
        className="flex justify-between items-center field-shadow bg-[#FFFFFF] text-black font-medium text-[14px]
       text-center md:w-[400px] md:px-4 py-2.5 mt-2 md:mx-2 rounded-2xl cursor-pointer"
        onClick={() => handleAppleLogin()}
      >
        <div>
          <FaApple className="text-[26px] ml-4" />
        </div>
        <div className="w-full"> Apple</div>
        {appleLoading && (
          <FiLoader className="text-[#1A293D] text-[32px] animate-spin me-2" />
        )}
      </div>
    </div>
  );
};

export default SocialLogin;
