import { product } from "./product";
export interface order {
  id?: number;
  user_id?: number;
  adress_delivery?: string;
  total: number;
  status: string;
  is_done: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface item {
  id?: number;
  product: product;
  order?: order;
  qte: number;
  price: number;
}

export async function addorderitem(token: string | null, dataitem: { product_id: number }): Promise<item | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/order_item", {
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
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
export async function getorderitems(token: string | null): Promise<item[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/order_item", {
      method: "get",
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
