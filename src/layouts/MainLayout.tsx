import { Outlet } from "react-router-dom";
import Topbar from "../components/home/Topbar";

const MainLayout = () => {
  return (
    <div>
      <Topbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
