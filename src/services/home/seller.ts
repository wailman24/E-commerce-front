import { user } from "../../pages/auth/signup";

export interface seller {
  id: number;
  user?: user;
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

export async function getallseller(token: string | null): Promise<seller[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallseller", {
      method: "GET",
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
    console.error("Error when getting sellers:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getpendingsellers(token: string | null): Promise<seller[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getpendingsellers", {
      method: "GET",
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
    console.error("Error when getting sellers:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getseller(token: string | null, user_id: number | undefined): Promise<seller | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/getseller/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch seller." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateseller(
  token: string | null,
  sellerId: number | undefined,
  formData: FormData
): Promise<seller | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updateseller/${sellerId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token || ""}`,
        // Don't set Content-Type manually when using FormData
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to update seller." };
    }

    if (!data || !data.data) {
      return { error: "No seller data returned from server." };
    }

    return data.data;
  } catch (error) {
    console.error("Error during seller update:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updatesellerstatus(token: string | null, sellerid: number, newstatus: string): Promise<seller | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updatesellerstatus/${sellerid}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newstatus }),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to update seller." };
    }

    const data = await res.json();
    if (!data || !data.DATA) {
      return { error: "No seller data returned from server." };
    }
    return data.DATA;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteseller(token: string, id: number): Promise<{ success: boolean } | { error: string }> {
  const res = await fetch(`http://127.0.0.1:8000/api/deleteseller/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text };
  }

  return { success: true };
}
