import { user } from "../../pages/auth/signup";
import { product } from "./product";
export interface order {
  id: number;
  user?: user;
  adress_delivery?: string;
  total: number;
  status: string;
  is_done: boolean;
  items: item[];
  created_at?: string;
  updated_at?: string;
}

export interface orderchart {
  date: string;
  ordersCount: number;
}

export interface item {
  id: number;
  product: product;
  order?: order;
  qte: number;
  price: number;
  status?: string;
}
export interface AdminDashboardData {
  role: "admin";
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalSellers: number;
  pendingOrders: number;
}

export interface SellerDashboardData {
  myProducts: string | number;
  role: "seller";
  myOrders: number;
  myRevenue: number;
  pendingProducts: number;
}

type CardsData = AdminDashboardData | SellerDashboardData;
export async function getallorders(token: string | null): Promise<order[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/allorders", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function order_history(token: string | null): Promise<order[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/order_history", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getOrdersCountChartData(token: string | null): Promise<orderchart[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getOrdersCountChartData", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch data." };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getcardsdata(token: string | null): Promise<CardsData | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getCardsData", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch data." };
    }

    const data = await res.json();
    return data as CardsData;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getallitems(token: string | null): Promise<item[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/allitems", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch items." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function addorderitem(token: string | null, dataitem: { product_id: number }): Promise<item | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/order_item", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataitem),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getorderitems(token: string | null): Promise<item[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/order_item", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function inc(token: string | null, order_item: number): Promise<item | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/inc/${order_item}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function dec(token: string | null, order_item: number): Promise<item | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/dec/${order_item}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteitem(token: string | null, order_item: number): Promise<item | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/order_item/${order_item}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function isexistincart(token: string | null, product_id: number): Promise<{ exists: boolean } | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/order_item/${product_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch orders." };
    }

    const data = await res.json();
    if (typeof data.data === "boolean") {
      return { exists: data.data };
    }

    return { exists: false };

    //return data.data;
  } catch (error) {
    console.error("Error during :", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getselleritems(token: string | null): Promise<item[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallselleritems", {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch items." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateitemstatus(token: string | null, order_item: number, status: string): Promise<item | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/updateitemstatus/${order_item}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch order." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during process:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
