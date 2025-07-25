import { Link, useNavigate } from "react-router-dom";
import { HeartIcon, User, ShoppingCartIcon } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";

import CategoryDropdown from "../ui/CategoryDropdown";

const Topbar = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  if (!appContext) throw new Error("Topbar must be used within an AppProvider");

  const { wishlistCount, cartCount, user, logout } = appContext;

  const [showDropdown, setShowDropdown] = useState(false);
  // const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Setup FCM + Firebase DB notifications for Admin

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="shadow">
      {/* Top White Bar */}
      <div className="bg-white px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          Shop<span className="text-black">O</span>
        </Link>

        {/*         <input type="text" placeholder="Search Product..." className="w-1/2 px-4 py-2 border rounded-full outline-none" />
         */}
        <Link to="/becomeseller">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">Become Seller</button>
        </Link>
      </div>

      {/* Bottom Blue Bar */}
      <div className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between">
        <CategoryDropdown />

        <nav>
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-green-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/bestselling" className="hover:text-green-300">
                Best Selling
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-green-300">
                Products
              </Link>
            </li>
            {user?.role === "Seller" && (
              <li>
                <Link to="/dash" className="hover:text-green-300">
                  Seller Dashboard
                </Link>
              </li>
            )}
            {user?.role === "Admin" && (
              <li>
                <Link to="/admindash" className="hover:text-green-300">
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/faq" className="hover:text-green-300">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Wishlist */}
          <Link to="/wishlist">
            <div className="relative">
              <HeartIcon className="text-white w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <div className="relative ml-4">
              <ShoppingCartIcon className="text-white w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none">
              <User className="text-white w-6 h-6 hover:text-green-300" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 text-black">
                <Link to="/user/about" className="block px-4 py-2 hover:bg-gray-100">
                  👤 Profile
                </Link>
                <Link to="/user/settings" className="block px-4 py-2 hover:bg-gray-100">
                  ⚙️ Settings
                </Link>

                <div className="border-t my-2" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
