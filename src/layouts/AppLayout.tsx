import Header from "../components/layout/Header";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppStore } from "../store/appStore";
import { useEffect } from "react";

interface LayoutProps {
  token: string | null;
}

const AppLayout = ({ token }: LayoutProps) => {
  const { fetchUser } = useAppStore();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (token && path.startsWith("/verify-login-otp")) {
    return <Navigate to="/connect-account" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default AppLayout;
