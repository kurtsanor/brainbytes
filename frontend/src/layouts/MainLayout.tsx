import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
