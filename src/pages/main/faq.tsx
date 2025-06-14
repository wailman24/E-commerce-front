import { AppContext } from "../../Context/AppContext";
import { useContext, useState } from "react";

export default function FeedbackForm() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/addFeedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      setStatus("Thank you for your feedback!");
      setMessage("");
    } else {
      setStatus("Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Submit Your Feedback</h2>
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={5}
        placeholder="Your comments or questions..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700" onClick={handleSubmit}>
        Send
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
