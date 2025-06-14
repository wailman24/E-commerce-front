import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, MailCheck, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AppContext } from "../../Context/AppContext";
import { useContext, useState } from "react";

interface LoginFormProps {
  handlelogin: (
    data: { email: string; password: string },
    setToken: (token: string | null) => void
  ) => Promise<{ token?: string; error?: string }>;
}

export function LoginForm({ handlelogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  if (!appContext) {
    throw new Error("LoginForm must be used within an AppProvider");
  }
  const { setToken } = appContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await handlelogin({ email, password }, setToken);
      if (result?.error) {
        setError(result.error);
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError("An unexpected error occurred." + err);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    setForgotError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotMessage("📧 Password reset link sent! Please check your inbox.");
      } else {
        setForgotError(data.error || "Failed to send reset link.");
      }
    } catch (err) {
      setForgotError("Server error. Please try again." + err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {!showForgot ? (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <button type="button" className="ml-auto text-sm underline hover:text-primary" onClick={() => setShowForgot(true)}>
                      Forgot your password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>{" "}
                or{" "}
                <Link to="/home" className="underline">
                  continue as guest
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit}>
              <div className="grid gap-4">
                <Label htmlFor="forgot-email">Enter your email to reset password</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />

                {forgotMessage && (
                  <Alert variant="default">
                    <MailCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{forgotMessage}</AlertDescription>
                  </Alert>
                )}

                {forgotError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{forgotError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForgot(false)}>
                  Back to Login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
