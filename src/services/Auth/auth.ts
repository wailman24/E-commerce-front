//import { AppContext } from "@/Context/AppContext";
import { user } from "@/pages/auth/signup";
//import { useContext } from "react";

export async function RegisterUser(
    data: user,
    setToken: (token: string | null) => void
) {
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
        } else {
            console.error("Registration failed:", result.message);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
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
