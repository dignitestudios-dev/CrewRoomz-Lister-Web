import Header from "../components/layout/Header";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppStore } from "../store/appStore";
import { useEffect } from "react";
import { requestNotificationPermission } from "../firebase/messages";

interface LayoutProps {
  token: string | null;
  identityStatus: string | unknown;
}

const AppLayout = ({ token, identityStatus }: LayoutProps) => {
  const { fetchUser, updateFcmToken } = useAppStore();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (token) {
      fetchUser();
      requestNotificationPermission().then((fcmToken) => {
        if (fcmToken) {
          updateFcmToken(fcmToken);
        }
      });
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (token && path.startsWith("/login") && identityStatus !== "approved") {
    return <Navigate to="/verif" replace />;
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
