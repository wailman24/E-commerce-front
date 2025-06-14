export interface product {
  id: number;
  name?: string;
  categorie?: string;
  category_id?: number;
  about?: string;
  prix: number;
  stock?: number;
  is_valid?: boolean;
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

export interface PaginatedProductResponse {
  data: product[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links?: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
  };
}
export async function getproduct(token: string | null, product_id: number): Promise<product | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/getproduct/${product_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch product." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getallproducts(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallproducts", {
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
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getnotvalidproductforadmin(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getnotvalidproductforadmin", {
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
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getallvalidproducts(token: string | null, page: number = 1): Promise<PaginatedProductResponse | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/getvalidproducts?page=${page}`, {
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

    const data: PaginatedProductResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getBestDealsProducts(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/getBestDealsProducts`, {
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
    console.log("result: ", data);
    return data.data as product[];
  } catch (error) {
    console.error("Error during process:", error);
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
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getnotvalidproductforseller(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getnotvalidproductforseller", {
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
    console.error("Error during :", error);
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
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateproduct(token: string | null, dataitem: product): Promise<product | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updateproduct/${dataitem.id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to update product." };
    }

    const data = await res.json();
    if (!data || !data.DATA) {
      return { error: "No product data returned from server." };
    }
    return data.DATA;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteproduct(token: string | null, Product_id: number): Promise<product | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/deleteproduct/${Product_id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to delete products." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteproductAdmin(token: string | null, Product_id: number): Promise<product | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/deleteproductadmin/${Product_id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to delete products." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateproductstatus(
  token: string | null,
  productid: number,
  newstatus: boolean
): Promise<product | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updateproductstatus/${productid}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_valid: newstatus }),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to update product." };
    }

    const data = await res.json();
    if (!data || !data.DATA) {
      return { error: "No product data returned from server." };
    }
    return data.DATA;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getcontentbasedproducts(token: string | null, product_id: number): Promise<product[] | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/recommendations/content/${product_id}`, {
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
    console.log("content-based data:", data);

    if (Array.isArray(data.data)) {
      return data.data;
    } else {
      return { error: "Invalid products format." };
    }
  } catch (error) {
    console.error("Error during content-based fetch:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getpopularproducts(token: string | null): Promise<product[] | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/recommendations/popular`, {
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
    console.log("popular data:", data);

    if (Array.isArray(data.data)) {
      return data.data;
    } else {
      return { error: "Invalid products format." };
    }
  } catch (error) {
    console.error("Error during popular fetch:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getcolaborativeproducts(token: string | null, UserID: number): Promise<product[] | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/recommendations/users/${UserID}`, {
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
    console.log("collaborative data:", data);

    if (Array.isArray(data.data)) {
      return data.data;
    } else {
      return { error: "Invalid products format." };
    }
  } catch (error) {
    console.error("Error during collaborative fetch:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
