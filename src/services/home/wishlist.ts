import { user } from "../../pages/auth/signup";
import { product } from "./product";

export interface wishlist {
  id: number;
  user: user;
  product: product;
}

export async function getwishlist(token: string | null): Promise<wishlist[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch best deal products." };
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function addtowishlist(token: string | null, dataitem: { product_id: number }): Promise<wishlist | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/wishlist/add", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch best deal products." };
    }

    const data = await res.json();
    if (!data || !data.data) {
      return { error: "No wishlist data returned from server." };
    }
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function isexist(token: string | null, product_id: number): Promise<{ exists: boolean } | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/existinwishlist/${product_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch data." };
    }

    const data = await res.json().catch(() => null);
    if (!data) return { error: "Empty response from server." };

    return { exists: data.exists };

    //return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
