import { Link } from "react-router-dom";
//import { user } from "@/pages/auth/signup";
//import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
//import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AppContext } from "../../Context/AppContext";
import { useContext, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

interface LoginFormProps extends React.ComponentProps<"div"> {
  handlelogin: (
    data: { email: string; password: string },
    setToken: (token: string | null) => void
  ) => Promise<{ token?: string; error?: string }>;
}
export function LoginForm({ handlelogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const appContext = useContext(AppContext); // Handle null case properly
  const navigate = useNavigate();

  // Ensure setToken is available
  if (!appContext) {
    throw new Error("SignupForm must be used within an AppProvider");
  }
  const { setToken } = appContext;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const result = await handlelogin({ email, password }, setToken);

      if (result?.error) {
        setError(result.error); // Set error message
      } else {
        console.log("Login successful", result);
        navigate("/home", { replace: true });

        // Redirect or perform any success action
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };
  //const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>{" "}
              or{" "}
              <Link to="/home" className="underline underline-offset-4">
                continue as guest
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
