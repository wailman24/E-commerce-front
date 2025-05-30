/* eslint-disable react-refresh/only-export-components */
import { user } from "@/pages/auth/signup";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getuser } from "../services/Auth/auth";
import { getwishlist } from "../services/home/wishlist";
import { getorderitems } from "../services/home/order";
interface AppContextType {
  user: user | null;
  token: string | null;
  setToken: (token: string | null) => void;
  wishlistCount: number;
  setWishlistCount: (wishlistCount: number) => void;
  cartCount: number;
  setCartCount: (cartCount: number) => void;
  logout: () => void;
  //setUser: (user: string) => void;
}
export const AppContext = createContext<AppContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState(0);
  //getuser(token);

  const logout = () => {
    localStorage.removeItem("token"); // or sessionStorage
    setUser(null); // clear user state
  };

  useEffect(() => {
    const fetchuser = async () => {
      if (token) {
        try {
          const response = await getuser(token);
          //console.log("Fetched User Data:", user);
          if (response?.data) {
            setUser(response.data); // Extract the actual user object
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
          setToken(null); // Clear token if fetch fails
        }
      } else {
        setUser(null);
      }
    };

    fetchuser();
  }, [token]);

  useEffect(() => {
    const fetchCounts = async () => {
      const wishlist = await getwishlist(token);

      if (!("error" in wishlist)) setWishlistCount(wishlist.length);

      const cart = await getorderitems(token);
      if (cart && !("error" in cart)) setCartCount(cart.length);
    };

    fetchCounts();
  }, [token]);
  return (
    <AppContext.Provider value={{ token, setToken, user, wishlistCount, setWishlistCount, cartCount, setCartCount, logout }}>
      {children}
    </AppContext.Provider>
  );
}
