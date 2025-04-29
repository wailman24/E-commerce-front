export interface seller {
  id?: number;
  user_id?: number;
  adress: string;
  phone: string;
  status?: string;
  store: string;
  logo?: File | null;
  paypal: string;
}

export async function addseller(token: string | null, data: seller): Promise<seller | { error: string }> {
  try {
    const formData = new FormData();
    formData.append("store", data.store);
    formData.append("phone", data.phone);
    formData.append("adress", data.adress);
    formData.append("paypal", data.paypal);
    if (data.logo) {
      formData.append("logo", data.logo); // ✅ Append file
    }

    const res = await fetch("http://127.0.0.1:8000/api/addseller", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ Don't set Content-Type! The browser sets it correctly for FormData
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to register seller." };
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
