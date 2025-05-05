export interface product {
  id: number;
  name?: string;
  category_id: number;
  about?: string;
  prix: number;
  stock?: number;
  is_valid?: string;
  seller_id?: number;
  created_at?: string;
  updated_at?: string;
  total_sold?: string;
  images?: {
    id?: number;
    image_url: string;
    is_main?: number;
    product_id?: number;
    created_at?: string;
    updated_at?: string;
  }[];
  reviewcount?: number;
  rating?: number;
}
export async function getbestdealsproducts(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getBestDealsProducts", {
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

export async function getallvalidproducts(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getvalidproducts", {
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

export async function getsellerproducts(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallproductsforsellers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch products." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function addproduct(token: string | null, dataitem: product): Promise<product | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/addproduct", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to add product." };
    }

    const data = await res.json();
    if (!data || !data.DATA) {
      return { error: "No product data returned from server." };
    }
    return data.DATA;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
