import { user } from "@/pages/auth/signup";
import { product } from "./product";

export interface review {
  id: number;
  user?: user;
  product?: product;
  rating: number;
  comment: string;
  updated_at?: string;
}

export async function getreviews(token: string | null, product_id: number): Promise<review[] | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/${product_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch reviews." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getallreviews(token: string | null, page = 1): Promise<{ data: review[]; meta: unknown } | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/getallreviews?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch reviews." };
    }

    const json = await res.json();
    return { data: json.data, meta: json.meta };
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function addreview(
  token: string | null,
  product_id: number,
  dataitem: { comment: string; rating: number }
): Promise<review | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/addreview/${product_id}`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to add review." };
    }

    const data = await res.json();
    if (!data || !data.review) {
      return { error: "No product data returned from server." };
    }
    return data.review;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updatereview(
  token: string | null,
  review_id: number,
  dataitem: { comment: string; rating: number }
): Promise<review | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updatereview/${review_id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to update review." };
    }

    const data = await res.json();
    if (!data || !data.review) {
      return { error: "No review data returned from server." };
    }
    return data.review;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deletereview(token: string | null, review_id: number): Promise<review | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/deletereview/${review_id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to delete review." };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
