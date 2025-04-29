import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Settings, LogOut } from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/seller/dashboard" },
  { label: "Products", icon: Package, to: "/seller/products" },
  { label: "Orders", icon: ShoppingCart, to: "/seller/orders" },
  { label: "Analytics", icon: BarChart2, to: "/seller/analytics" },
  { label: "Settings", icon: Settings, to: "/seller/settings" },
];

const SellerSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm fixed">
      <div className="p-6 text-xl font-bold border-b">Seller Panel</div>
      <nav className="flex flex-col p-4 space-y-2">
        {menuItems.map(({ label, icon: Icon, to }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100 transition ${
              location.pathname === to ? "bg-gray-100 font-semibold" : ""
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
        <button className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-red-100 text-red-600 mt-auto">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SellerSidebar;
