import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { addseller, seller } from "../../services/home/seller";

export default function BecomeSeller() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;

  const [store, setStore] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [paypal, setPaypal] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data: seller = {
      store,
      phone,
      adress,
      paypal,
      logo,
    };

    try {
      const response = await addseller(token, data);

      if (response && "error" in response) {
        setError(response.error);
      } else {
        setSuccess("Application submitted successfully!");
        // Clear form
        setStore("");
        setPhone("");
        setAdress("");
        setPaypal("");
        setLogo(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Become a Seller</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="store"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          placeholder="Store Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="adress"
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
          placeholder="Address"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="paypal"
          value={paypal}
          onChange={(e) => setPaypal(e.target.value)}
          placeholder="Paypal Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setLogo(e.target.files[0]);
            }
          }}
          className="w-full p-3 border rounded-lg"
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition">
          Submit Application
        </button>
      </form>
    </div>
  );
}
