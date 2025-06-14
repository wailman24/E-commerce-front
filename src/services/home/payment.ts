//import { seller } from "./seller";

export interface SellerPayout {
  id: number;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  unpaid_amount: number;
  paid_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Payouts {
  id: number;
  seller_id: number;
  seller_email: string;
  amount_paid: number;
  batch_id: string;
  paid_at?: string;
  created_at?: string;
}

export async function createPayment(token: string, order_id: number): Promise<{ token: string; approval_url: string } | { error: string }> {
  try {
    console.log(" order:", { order_id });
    const res = await fetch(`http://127.0.0.1:8000/api/payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id }), // ✅ wrap in object
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to create payment." };
    }

    return {
      token: data.token,
      approval_url: data.approval_url,
    };
  } catch (error) {
    console.error("Error during payment creation:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
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

export async function getsellerpayout(token: string): Promise<Payouts[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getMyPayouts", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch payouts." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function payOnDelivery(orderId: number, token: string | null) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/paymentondelivery/${orderId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Payment failed");
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error };
  }
}
