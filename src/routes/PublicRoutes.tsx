import { Navigate, Outlet, useLocation } from "react-router";

interface PublicRouteProps {
  token: string | null;
  identityStatus: string | unknown;
}

const PublicRoute = ({ token, identityStatus }: PublicRouteProps) => {
  const location = useLocation();
  const path = location.pathname;
  if (token) {
    if (path.startsWith("/verify-login-otp")) {
      return <Navigate to="/connect-account" replace />;
    } else if (
      token &&
      path.startsWith("/login") &&
      identityStatus !== "approved"
    ) {
      return <Navigate to="/verif" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }
  return <Outlet />;
};

export default PublicRoute;
