// import React, { useState } from "react";
import { googleIcon } from "../../assets/export";
import { FaApple } from "react-icons/fa";
// import app, { auth, googleProvider, appleProvider } from "../firebase/firebase";
// import { FacebookAuthProvider } from "firebase/auth";
// import { signInWithPopup } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { FiLoader } from "react-icons/fi";
// import axios from "../axios";
// import { ErrorToast } from "../components/Toaster";

const SocialLogin = () => {
  //   const navigate = useNavigate();
  //   const [googleLoading, setGoogleLoading] = useState(false);
  //   const [appleLoading, setAppleLoading] = useState(false);
  //   const [facebookLoading, setFacebookLoading] = useState(false);
  //   const [idToken, setIdToken] = useState(null);
  //   const [error, setError] = useState("");

  //   const handleAppleLogin = async () => {
  //     try {
  //       setAppleLoading(true);
  //       const result = await signInWithPopup(auth, appleProvider);

  //       if (result) {
  //         // const token = await result?.user?.getIdToken();
  //         if (result) {
  //           axios
  //             .post(`auth/dispensary-social-signup`, {
  //               idToken: result?._tokenResponse?.idToken,
  //               email: result?.user?.email,
  //             })
  //             .then(
  //               (response) => {
  //                 sessionStorage.setItem("token", response?.data?.data?.token);
  //                 if (response?.data?.success === true) {
  //                   navigate("/userinfo");
  //                 } else {
  //                   console.error(
  //                     "Login failed:",
  //                     response?.data?.message || "Unknown error"
  //                   );
  //                   ErrorToast(
  //                     response?.data?.message || "Login failed. Please try again."
  //                   );
  //                 }
  //               },
  //               (error) => {
  //                 console.log(error);
  //                 if (
  //                   error?.response?.status == 401 &&
  //                   error?.response?.data?.message == "No such user found"
  //                 ) {
  //                   setIdToken(token);
  //                   setShowModal(true);
  //                 }
  //                 setAppleLoading(false);
  //               }
  //             );
  //         }
  //       }
  //     } catch (err) {
  //       setAppleLoading(false);
  //       setError("Cannot open apple signin modal.");
  //     }
  //   };

  //   const handleGoogleLogin = async () => {
  //     try {
  //       setGoogleLoading(true);
  //       const result = await signInWithPopup(auth, googleProvider);

  //       if (result) {
  //         const token = await result?.user?.getIdToken();

  //         if (token) {
  //           axios
  //             .post(`auth/dispensary-social-signup`, {
  //               idToken: result?._tokenResponse?.idToken,
  //               email: result?.user?.email,
  //             })
  //             .then(
  //               (response) => {
  //                 sessionStorage.setItem("token", response?.data?.data?.token);

  //                 if (response?.data?.success === true) {
  //                   navigate("/userinfo");
  //                 } else {
  //                   console.error(
  //                     "Login failed:",
  //                     response?.data?.message || "Unknown error"
  //                   );
  //                   ErrorToast(
  //                     response?.data?.message || "Login failed. Please try again."
  //                   );
  //                 }
  //               },
  //               (error) => {
  //                 console.log(error);

  //                 if (
  //                   error?.response?.status === 401 &&
  //                   error?.response?.data?.message === "No such user found"
  //                 ) {
  //                   setIdToken(token);
  //                   setShowModal(true);
  //                 } else {
  //                   console.error("Unexpected error:", error);
  //                   ErrorToast("An unexpected error occurred.");
  //                 }

  //                 setGoogleLoading(false);
  //               }
  //             );
  //         } else {
  //           throw new Error("Failed to retrieve token from Google login.");
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Google login error:", err);
  //       setError("Cannot open google signin modal.");
  //     } finally {
  //       setGoogleLoading(false);
  //     }
  //   };

  return (
    <div className="md:flex md:justify-center w-[60%] py-2 mb-4">
      <div
        // onClick={() => handleGoogleLogin()}
        className=" flex justify-between items-center h-[50px] field-shadow bg-[#FFFFFF] text-black font-medium text-[14px]
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
        {/* {googleLoading && (
          <FiLoader className="text-[#1A293D] text-[32px] animate-spin me-2" />
        )} */}
      </div>
      <div
        className="flex justify-between items-center field-shadow bg-[#FFFFFF] text-black font-medium text-[14px]
       text-center md:w-[400px] md:px-4 py-2.5 mt-2 md:mx-2 rounded-2xl"
        // onClick={() => handleAppleLogin()}
      >
        <div>
          <FaApple className="text-[26px] ml-4" />
        </div>
        <div className="w-full"> Apple</div>
      </div>
    </div>
  );
};

export default SocialLogin;
