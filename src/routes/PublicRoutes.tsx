import { Navigate, Outlet, useLocation } from "react-router";

interface PublicRouteProps {
  token: string | null;
}

const PublicRoute = ({ token }: PublicRouteProps) => {
  const location = useLocation();
  const path = location.pathname;
  if (token) {
    if (path.startsWith("/verify-login-otp")) {
      return <Navigate to="/connect-account" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }
  return <Outlet />;
};

export default PublicRoute;
