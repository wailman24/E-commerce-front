export interface category {
  id: number;
  name?: string;
  category_id?: number;
  parent_category?: category;
  product_count?: number;
  subcategories?: category[];
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
export async function popularecatego(token: string | null): Promise<category[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getPopularCategories", {
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
    return data;
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

    return data.DATA;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updatecategory(token: string | null, dataitem: category): Promise<category | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updatecategory/${dataitem.id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to update category." };
    }

    const data = await res.json();
    if (!data || !data.DATA) {
      return { error: "No category data returned from server." };
    }
    return data.DATA;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deletecategory(token: string | null, category: number): Promise<category | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/deletecategory/${category}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to delete category." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
