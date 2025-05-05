export interface category {
  id?: number;
  name?: string;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getcategories(token: string | null): Promise<category[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallcategory", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch categories." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error when getting categories:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function addcategory(token: string | null, dataitem: category): Promise<category | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/addcategory", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to add category." };
    }

    const data = await res.json();
    if (!data || !data.data) {
      return { error: "No category data returned from server." };
    }
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
