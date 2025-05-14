import { Link } from "react-router-dom";
import { HeartIcon, User, ShoppingCartIcon } from "lucide-react";
import CategoryDropdown from "../ui/CategoryDropdown";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
const Topbar = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { wishlistCount, cartCount, user } = appContext;
  console.log(wishlistCount);
  console.log("Role:", user?.role);
  return (
    <header className="shadow">
      {/* Top White Bar */}
      <div className="bg-white px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          Shop<span className="text-black">O</span>
        </Link>

        {/* Search */}
        <input type="text" placeholder="Search Product..." className="w-1/2 px-4 py-2 border rounded-full outline-none" />

        {/* Become Seller */}
        <Link to="/becomeseller">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">Become Seller</button>
        </Link>
      </div>

      {/* Bottom Blue Bar */}
      <div className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between">
        {/* Left: Categories Dropdown */}
        <div className="flex items-center gap-2  text-black">
          <CategoryDropdown />
        </div>

        {/* Center: Navigation Links */}
        <nav>
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-green-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/best-selling" className="hover:text-green-300">
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

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
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
          <Link to="/profile">
            <User className="hover:text-green-300" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
