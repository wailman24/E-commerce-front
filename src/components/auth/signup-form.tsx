//import { VerifyOtp } from "../../services/Auth/auth";
import { user } from "@/pages/auth/signup";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AppContext } from "../../Context/AppContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Otpverification from "../../components/auth/verity-otp";
//import { toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";

interface SignupFormProps extends React.ComponentProps<"div"> {
  handleregister: (
    data: user
    // setToken: (token: string | null) => void
  ) => Promise<{ error?: string }>;
}

export function SignupForm({ handleregister }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);
  const appContext = useContext(AppContext); // Handle null case properly
  // Ensure setToken is available
  if (!appContext) {
    throw new Error("SignupForm must be used within an AppProvider");
  }
  //const { setToken } = appContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const result = await handleregister({ name, email, password });

      if (result?.error) {
        setError(result.error); // Set error message
      } else {
        setSuccess(true);
        console.log("Register successful", result);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const closeOtp = () => setSuccess(false);

  //const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Crate new account</CardTitle>
          <CardDescription>
            Enter your name and email to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="m batata"
                  required
                />
              </div>
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
                  {/*  <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <Otpverification
                      name={name}
                      email={email}
                      password={password}
                      closeOtp={closeOtp}
                    />
                  </div>
                </div>
              )}
              {/*    */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Register
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              you have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
