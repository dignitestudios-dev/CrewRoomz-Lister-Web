import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import LoginOtp from "../pages/auth/LoginOtp";
import PasswordOtp from "../pages/auth/PasswordOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import SignUp from "../pages/auth/SignUp";

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
