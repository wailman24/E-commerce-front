//import React from 'react'
import { SignupForm } from "../../components/auth/signup-form";
import { RegisterUser } from "../../services/Auth/auth";

export interface user {
    id?: number;
    name: string;
    email: string;
    password: string;
    role?: string;
}
function Signup() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm handleregister={RegisterUser} />
            </div>
        </div>
    );
}

export default Signup;
