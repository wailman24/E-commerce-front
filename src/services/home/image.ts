export interface image {
  id?: number;
  image_url?: string;
  is_main?: boolean;
  product_id?: number;
  created_at?: string;
  updated_at?: string;
}
export async function addimage(token: string | null, product_id: number, file: File): Promise<image | { error: string }> {
  try {
    const formData = new FormData();
    formData.append("product_id", product_id.toString());
    formData.append("image_url", file); // ✅ must match Laravel validation rule

    const res = await fetch("http://127.0.0.1:8000/api/addimage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT SET Content-Type when using FormData
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || "Failed to upload image." };
    }

    return data.DATA;
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteimage(token: string | null, image_id: number): Promise<image | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/deleteimage/${image_id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch images." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
