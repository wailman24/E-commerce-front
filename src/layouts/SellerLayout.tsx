import { Outlet } from "react-router-dom";
import SellerSidebar from "../components/home/SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="flex">
      <SellerSidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
