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
  isAuthenticated: boolean;
}

export const AppContext = createContext<AppContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState(0);

  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const fetchuser = async () => {
      if (token) {
        try {
          const response = await getuser(token);
          if (response?.data) {
            setUser(response.data);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchuser();
  }, [token]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) return;

      const wishlist = await getwishlist(token);
      if (!("error" in wishlist)) setWishlistCount(wishlist.length);

      const cart = await getorderitems(token);
      if (cart && !("error" in cart)) setCartCount(cart.length);
    };

    fetchCounts();
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        user,
        wishlistCount,
        setWishlistCount,
        cartCount,
        setCartCount,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
