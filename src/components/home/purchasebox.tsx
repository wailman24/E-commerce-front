import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { addorderitem, isexistincart } from "../../services/home/order";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type PurchaseBoxProps = {
  price: number;
  stock: number;
};

const PurchaseBox: React.FC<PurchaseBoxProps> = ({ price, stock }) => {
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const productId = Number(params.id);
  const navigate = useNavigate();

  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("PurchaseBox must be used within an AppProvider");

  const { token, setCartCount, cartCount, isAuthenticated } = appContext;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= stock) {
      setQuantity(val);
    }
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    e.preventDefault();
    setError("");
    setCartLoading(true);

    if (!token) {
      setError("You must be logged in to add to cart.");
      setCartLoading(false);
      return;
    }

    if (!productId) {
      setError("Invalid product ID.");
      setCartLoading(false);
      return;
    }

    try {
      const check = await isexistincart(token, productId);
      const response = await addorderitem(token, {
        product_id: productId,
        qte: quantity,
      });

      if (response && "error" in response) {
        setError(response.error);
        console.error("Error adding to cart:", response.error);
      } else {
        if ("exists" in check && check.exists === false) {
          setCartCount(cartCount + 1);
        }
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddToCart} className="border rounded-lg p-4 shadow-md flex flex-col gap-4">
      <p className="text-2xl font-bold text-gray-900">{price} DZD</p>
      <p className={`font-semibold ${stock > 0 ? "text-green-600" : "text-red-600"}`}>{stock > 0 ? "In Stock" : "Out of Stock"}</p>

      <label className="text-sm font-medium" htmlFor="quantity">
        Quantity:
      </label>
      <input
        type="number"
        id="quantity"
        className="border rounded px-2 py-1 text-sm w-20"
        value={quantity}
        onChange={handleQuantityChange}
        min={1}
        max={stock}
        disabled={stock === 0}
      />

      <button
        type="submit"
        disabled={cartLoading || stock === 0}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
      >
        {cartLoading ? "Adding..." : "Add to Cart"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default PurchaseBox;
