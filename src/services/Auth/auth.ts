//import { AppContext } from "@/Context/AppContext";
import { user } from "@/pages/auth/signup";
//import { useContext } from "react";

export async function RegisterUser(
  data: user,
  setToken: (token: string | null) => void
): Promise<{ token?: string; error?: string }> {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.token) {
      setToken(result.token);
      localStorage.setItem("token", result.token);
      console.log("Token received:", result.token);
      return { token: result.token };
    } else {
      return { error: result.message || "Login failed. Please try again." };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function LoginUser(
  data: { email: string; password: string },
  setToken: (token: string | null) => void
): Promise<{ token?: string; error?: string }> {
  // ✅ Explicit return type
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.token) {
      setToken(result.token);
      localStorage.setItem("token", result.token);
      console.log("Token received:", result.token);
      return { token: result.token }; // ✅ Return an object for success case
    } else {
      console.error("Login failed:", result.message);
      return { error: result.message || "Login failed. Please try again." };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getuser(token: string) {
  const res = await fetch("http://127.0.0.1:8000/api/getuser", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
}
