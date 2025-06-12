export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
      <p className="text-gray-700">Your payment was cancelled or not completed.</p>
      <p className="text-sm mt-2 text-gray-500">If this was a mistake, please try again.</p>
    </div>
  );
}
