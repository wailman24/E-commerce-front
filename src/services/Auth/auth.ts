//import { AppContext } from "@/Context/AppContext";
import { user } from "@/pages/auth/signup";
//import { useContext } from "react";

export interface feedback {
  id: number;
  user_id?: number;
  user?: user;
  email?: string;
  message?: string;
  created_at?: string;
}

export async function RegisterUser(
  data: user
  //setToken: (token: string | null) => void
): Promise<{ error?: string }> {
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

    if (response.ok) {
      /*  setToken(result.token);
      localStorage.setItem("token", result.token);
      console.log("Token received:", result.token); */
      return {};
    } else {
      return { error: result.message || "register failed. Please try again." };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function VerifyOtp(
  data: user,
  pin: string
  //setToken: (token: string | null) => void
): Promise<{ error?: string }> {
  try {
    const requestBody = {
      name: data.name, // Assuming `data` contains `name`, `email`, etc.
      email: data.email,
      password: data.password,
      otp: pin, // Attach the pin value to the body
    };
    const response = await fetch("http://127.0.0.1:8000/api/verify-otp", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (response.ok) {
      /*  setToken(result.token);
      localStorage.setItem("token", result.token);
      console.log("Token received:", result.token); */
      return {};
    } else {
      return { error: result.message || "register failed. Please try again." };
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

  if (!res.ok) {
    const text = await res.text(); // Read it as plain text to prevent JSON parse error
    console.error("Failed to fetch user:", text);
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return res.json();
}

export async function getallusers(token: string | null): Promise<user[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getalluser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch users." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error when getting users:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteuser(token: string | null, user_id: number): Promise<user | { error: string }> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/deleteuser/${user_id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to delete user." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during deleting:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateuser(
  token: string | null,
  data: { name: string; email: string; password: string | undefined }
): Promise<user | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/updateuser", {
      method: "PUT", // or "POST" depending on your route setup
      headers: {
        Authorization: `Bearer ${token || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) {
      return { error: response.message || "Failed to update user." };
    }

    if (!response || !response.user) {
      return { error: "No user data returned from server." };
    }

    return response.user;
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getuserbyid(token: string, id: number): Promise<user | { error: string }> {
  const res = await fetch(`http://127.0.0.1:8000/api/getuserbyid/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text(); // Read as plain text for debugging
    console.error("Failed to fetch user:", text);
    return { error: `Failed to fetch user: ${res.status}` };
  }

  const json = await res.json();

  // Ensure API response structure matches expected format
  if (json && json.data) {
    return json.data as user;
  }

  return { error: "Invalid response format from server" };
}

export async function getfbksbyuserid(token: string, id: number): Promise<feedback[] | { error: string }> {
  const res = await fetch(`http://127.0.0.1:8000/api/getfdbksbyuserid/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch feedback:", text);
    return { error: `Failed to fetch feedback: ${res.status}` };
  }

  const json = await res.json();

  if (json && Array.isArray(json.data)) {
    return json.data as feedback[];
  }

  return { error: "Invalid response format from server" };
}

export async function getallfbks(token: string | null): Promise<feedback[] | { error: string }> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/getallfbks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to fetch feedbacks." };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error when getting feedbacks:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
