//import { seller } from "./seller";

export interface SellerPayout {
  id: number;
  seller_name: string;
  seller_email: string;
  unpaid_amount: number;
  paid_amount: number;
  created_at?: string;
  updated_at?: string;
}

export async function getPendingPayouts(token: string): Promise<SellerPayout[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallsellerearnings", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch sellers." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function paySeller(token: string, sellerId: number) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/payoutToSeller/${sellerId}`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      //body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch payouts." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
