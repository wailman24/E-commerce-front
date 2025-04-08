import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User } from "lucide-react";
import CategoryDropdown from "../ui/CategoryDropdown";
const Topbar = () => {
  return (
    <header className="shadow">
      {/* Top White Bar */}
      <div className="bg-white px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          Shop<span className="text-black">O</span>
        </Link>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Product..."
          className="w-1/2 px-4 py-2 border rounded-full outline-none"
        />

        {/* Become Seller */}
        <Link to="/become-seller">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
            Become Seller
          </button>
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
            <li>
              <Link to="/events" className="hover:text-green-300">
                Events
              </Link>
            </li>
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
            <Heart className="hover:text-green-300" />
          </Link>
          <Link to="/cart">
            <ShoppingCart className="hover:text-green-300" />
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
