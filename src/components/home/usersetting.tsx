// components/settings/UserSettings.tsx
import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";

const UserSettings: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Must be used within AppProvider");

  const { token, user } = appContext;
  const isSeller = user?.role_id === 2; // assuming 2 = seller

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    store: user?.seller?.store || "",
    phone: user?.seller?.phone || "",
    adress: user?.seller?.adress || "",
    paypal: user?.seller?.paypal || "",
    logo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (isSeller) {
        formData.append("store", form.store);
        formData.append("phone", form.phone);
        formData.append("adress", form.adress);
        formData.append("paypal", form.paypal);
        if (form.logo) {
          formData.append("logo", form.logo);
        }

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/updateseller/${user?.seller?.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Seller profile updated!");
      } else {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/updateuser/${user?.id}`,
          {
            name: form.name,
            email: form.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("User profile updated!");
      }
    } catch (error: any) {
      console.error(error);
      alert("Update failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {!isSeller && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </>
      )}

      {isSeller && (
        <>
          <input
            type="text"
            name="store"
            placeholder="Store Name"
            value={form.store}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="adress"
            placeholder="Address"
            value={form.adress}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="paypal"
            placeholder="PayPal Email"
            value={form.paypal}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input type="file" name="logo" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" />
        </>
      )}

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Update Profile
      </button>
    </form>
  );
};

export default UserSettings;
