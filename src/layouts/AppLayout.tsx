import Header from "../components/layout/Header";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default AppLayout;
