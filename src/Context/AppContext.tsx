/* eslint-disable react-refresh/only-export-components */
import { user } from "@/pages/auth/signup";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getuser } from "../services/Auth/auth";
interface AppContextType {
    user: user | null;
    token: string | null;
    setToken: (token: string | null) => void;
    //setUser: (user: string) => void;
}
export const AppContext = createContext<AppContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<user | null>({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    //getuser(token);

    useEffect(() => {
        const fetchuser = async () => {
            if (token) {
                try {
                    const response = await getuser(token);
                    console.log("Fetched User Data:", user);
                    if (response?.data) {
                        setUser(response.data); // Extract the actual user object
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    setUser(null);
                    setToken(null); // Clear token if fetch fails
                }
            } else {
                setUser(null);
            }
        };

        fetchuser();
    }, [token]);
    return (
        <AppContext.Provider value={{ token, setToken, user }}>
            {children}
        </AppContext.Provider>
    );
}
