import Header from "../components/layout/Header";
import { Navigate, Outlet } from "react-router";
import { useAppStore } from "../store/appStore";
import { useEffect } from "react";

interface LayoutProps {
  token: string | null;
}

const AppLayout = ({ token }: LayoutProps) => {
  const { fetchUser } = useAppStore();
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default AppLayout;
