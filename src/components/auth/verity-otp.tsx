import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VerifyOtp } from "../../services/Auth/auth";
import { user } from "@/pages/auth/signup";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
// Define OTP Schema
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
function getEmailProvider(email: string) {
  const domain = email.split("@")[1];
  switch (domain) {
    case "gmail.com":
      return "https://mail.google.com/";
    case "yahoo.com":
      return "https://mail.yahoo.com/";
    case "outlook.com":
    case "hotmail.com":
      return "https://outlook.live.com/mail/";
    default:
      return "mailto:";
  }
}
// OTP Form Component
function InputOTPForm({
  name,
  email,
  password,
  closeOtp,
}: user & { closeOtp: () => void }) {
  const [emailMessage, setEmailMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Handle form submission
  const handlVerify = async (dpin: z.infer<typeof FormSchema>) => {
    const { pin } = dpin;
    console.log(pin, name, email, password);
    try {
      const emailLink = getEmailProvider(email);
      setEmailMessage(
        `✅ A verification email has been sent to ${email}.\nOpen your email: ${emailLink}`
      );
      const result = await VerifyOtp(
        {
          name,
          email,
          password,
        },
        pin
      );

      if (result?.error) {
        setError(result.error); // Set error message if any
      } else {
        console.log("Register successful", result);
        closeOtp(); // Close OTP modal after success
        navigate("/auth/login");
      }
    } catch (err) {
      // Catch any errors and log them
      console.error("Error in OTP verification:", err);
      setError("An unexpected error occurred.");
    }
  };
  return (
    <div className="flex flex-col gap-6 relative">
      {/* ❌ Close button */}
      <button
        onClick={closeOtp}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        <X className="h-5 w-5" />
      </button>
      <Card>
        <CardHeader>
          <CardTitle>OTP Verification</CardTitle>
          <CardDescription>
            Enter the one-time password sent to your phone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" onClick={form.handleSubmit(handlVerify)}>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-green-500">
            {emailMessage}{" "}
            <a
              href={getEmailProvider(email)}
              target="_blank"
              className="text-blue-500 underline"
            >
              Open Email
            </a>
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Main Component
function Otpverification({
  name,
  email,
  password,
  closeOtp,
}: user & { closeOtp: () => void }) {
  return (
    <InputOTPForm
      name={name}
      email={email}
      password={password}
      closeOtp={closeOtp}
    />
  );
}

export default Otpverification;
