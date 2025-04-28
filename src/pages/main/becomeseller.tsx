import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { addseller, seller } from "../../services/home/seller";
export default function BecomeSeller() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [formData, setFormData] = useState<seller | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await addseller(token, formData);

      if (response && "error" in response) {
        console.log(error);
        //setCartCount(cartCount + 1);
        setError(response.error);
      } else {
        console.log(response);
        setError(null);
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
          value={formData.store}
          onChange={handleChange}
          placeholder="Store Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="adress"
          value={formData.adress}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="paypal"
          value={formData.paypal}
          onChange={handleChange}
          placeholder="Paypal Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input type="file" name="logo" onChange={handleChange} accept="image/*" className="w-full p-3 border rounded-lg" />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition">
          Submit Application
        </button>
      </form>
    </div>
  );
}
