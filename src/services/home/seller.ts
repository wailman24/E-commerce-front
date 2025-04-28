export interface seller {
  id?: number;
  user_id?: number;
  adress?: string;
  phone: number;
  status: string;
  store: string;
  logo: File;
  paypal: string;
}

export async function addseller(token: string | null, data: seller | null): Promise<seller | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/order_item", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch best deal products." };
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
