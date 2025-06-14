/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useEffect, useState } from "react";
import { user } from "@/pages/auth/signup";
import { getuser } from "../services/Auth/auth";
import { getwishlist, wishlist } from "../services/home/wishlist";
import { getorderitems } from "../services/home/order";

interface AppContextType {
  user: user | null;
  token: string | null;
  setToken: (token: string | null) => void;
  wishlistCount: number;
  setWishlistCount: (count: number) => void;
  wishlistItems: number[]; // list of product IDs
  setWishlistItems: (items: number[]) => void;
  cartCount: number;
  setCartCount: (count: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AppContext = createContext<AppContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setWishlistCount(0);
    setWishlistItems([]);
    setCartCount(0);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return setUser(null);

      try {
        const response = await getuser(token);
        if (response?.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
        setToken(null);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token || !user) return;

      try {
        const wishlistData = await getwishlist(token);
        if (!("error" in wishlistData)) {
          const wishlistArray = wishlistData as wishlist[];
          setWishlistCount(wishlistArray.length);
          setWishlistItems(wishlistArray.map((item) => item.product.id));
        } else {
          setWishlistCount(0);
          setWishlistItems([]);
        }

        const cart = await getorderitems(token);
        if (!("error" in cart)) {
          setCartCount(cart.length);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        console.error("Error loading wishlist/cart:", err);
        setWishlistCount(0);
        setWishlistItems([]);
        setCartCount(0);
      }
    };

    fetchCounts();
  }, [token, user]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        user,
        wishlistCount,
        setWishlistCount,
        wishlistItems,
        setWishlistItems,
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
