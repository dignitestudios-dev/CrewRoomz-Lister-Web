import { Navigate, Outlet } from "react-router";

interface PublicRouteProps {
  token: string | null;
}

const PublicRoute = ({ token }: PublicRouteProps) => {
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
