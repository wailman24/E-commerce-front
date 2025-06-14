import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: confirm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Your password has been reset. You can now log in.");
        setError("");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Something went wrong.");
        setMessage("");
      }
    } catch (err) {
      setError("Server error. Please try again." + err);
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

      {message && (
        <Alert variant="default" className="mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-700">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showPassword1 ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword1((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword1 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative">
          <Input
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword2((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
