import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";
import LoginOtp from "../pages/LoginOtp";
import PasswordOtp from "../pages/PasswordOtp";
import ResetPassword from "../pages/ResetPassword";
import SignUp from "../pages/SignUp";

export const AuthRoute = [
  {
    url: "login",
    page: <Login />,
    isPublic: true,
  },
  {
    url: "signup",
    page: <SignUp />,
    isPublic: true,
  },
  {
    url: "forgot-password",
    page: <ForgotPassword />,
    isPublic: true,
  },
  {
    url: "verify-login-otp",
    page: <LoginOtp />,
    isPublic: true,
  },
  {
    url: "verify-password-otp",
    page: <PasswordOtp />,
    isPublic: true,
  },
  {
    url: "reset-password",
    page: <ResetPassword />,
    isPublic: true,
  },
];
