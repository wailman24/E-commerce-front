import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const payerId = params.get("PayerID");

  useEffect(() => {
    // Optional: Clear shopping cart or refetch data
    console.log("Payment confirmed with token:", token, "and payerId:", payerId);
  }, [token, payerId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-700">Your payment has been confirmed.</p>
      <p className="text-sm mt-2 text-gray-500">Token: {token}</p>
      <p className="text-sm text-gray-500">Payer ID: {payerId}</p>
    </div>
  );
}
