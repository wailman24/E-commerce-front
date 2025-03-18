//import React from 'react'
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

function Home() {
    const appContext = useContext(AppContext); // Handle null case properly
    // Ensure setToken is available
    if (!appContext) {
        throw new Error("SignupForm must be used within an AppProvider");
    }
    const { token, user } = appContext;
    return (
        <>
            <div>token: {token}</div>
            <div>user name: {user?.name}</div>
            <div>user email: {user?.email}</div>
            <div>user role: {user?.role}</div>
        </>
    );
}

export default Home;
