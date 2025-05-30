import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { updateuser } from "../../services/Auth/auth";
import { updateseller } from "../../services/home/seller";

const UserSettings: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Must be used within AppProvider");

  const { user, token } = appContext;
  const isSeller = user?.role_id === 2;

  const [userError, setUserError] = useState<string | null>(null);
  const [sellerError, setSellerError] = useState<string | null>(null);

  const [userForm, setUserForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const [sellerForm, setSellerForm] = useState({
    store: user?.seller?.store || "",
    phone: user?.seller?.phone || "",
    adress: user?.seller?.adress || "",
    paypal: user?.seller?.paypal || "",
    logo: null as File | null,
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setSellerForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setSellerForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password.trim() !== "" ? userForm.password : undefined,
      };

      const res = await updateuser(token, payload);
      if (res && "error" in res) {
        setUserError(res.error);
      } else {
        setUserError(null);
        alert("User info updated successfully!");
      }
    } catch (err) {
      console.error("User update failed", err);
      alert("User update failed. Check the console.");
    }
  };

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("store", sellerForm.store);
      formData.append("phone", sellerForm.phone);
      formData.append("adress", sellerForm.adress);
      formData.append("paypal", sellerForm.paypal);

      // ✅ Append logo only if it's selected
      if (sellerForm.logo instanceof File) {
        formData.append("logo", sellerForm.logo);
      }

      const res = await updateseller(token, user?.seller?.id, formData);
      if (res && "error" in res) {
        setSellerError(res.error);
      } else {
        setSellerError(null);
        alert("Seller info updated successfully!");
      }
    } catch (err) {
      console.error("Seller update failed", err);
      alert("Seller update failed. Check the console.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* User Section */}
      <form onSubmit={handleUserSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">👤 Update User Information</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userForm.name}
          onChange={handleUserChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userForm.email}
          onChange={handleUserChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="New Password (optional)"
          value={userForm.password}
          onChange={handleUserChange}
          className="w-full border p-2 rounded"
        />
        {userError && <p className="text-red-500">{userError}</p>}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Update User
        </button>
      </form>

      {/* Seller Section */}
      {isSeller && (
        <form onSubmit={handleSellerSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">🏪 Update Seller Information</h2>

          <input
            type="text"
            name="store"
            placeholder="Store Name"
            value={sellerForm.store}
            onChange={handleSellerChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={sellerForm.phone}
            onChange={handleSellerChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="adress"
            placeholder="Address"
            value={sellerForm.adress}
            onChange={handleSellerChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="paypal"
            placeholder="PayPal Email"
            value={sellerForm.paypal}
            onChange={handleSellerChange}
            className="w-full border p-2 rounded"
            required
          />

          <div>
            <label className="block font-medium mb-1">Store Logo (optional)</label>
            <input type="file" name="logo" accept="image/*" onChange={handleSellerChange} className="w-full border p-2 rounded" />

            {/* ✅ Show current logo if no new file selected */}
            {!sellerForm.logo && user?.seller?.logo && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current logo:</p>
                <img
                  src={`http://127.0.0.1:8000/storage/${user.seller.logo}`}
                  alt="Current logo"
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {sellerError && <p className="text-red-500">{sellerError}</p>}
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Update Seller
          </button>
        </form>
      )}
    </div>
  );
};

export default UserSettings;
