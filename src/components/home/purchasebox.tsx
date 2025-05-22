import React, { useState } from "react";

type PurchaseBoxProps = {
  price: number;
  stock: number;
};

const PurchaseBox: React.FC<PurchaseBoxProps> = ({ price, stock }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= stock) {
      setQuantity(val);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col gap-4">
      <p className="text-2xl font-bold text-gray-900">{price} DZD</p>
      <p className="text-green-600 font-semibold">In Stock</p>

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
      />

      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded">Add to Cart</button>
      <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded">Buy Now</button>
    </div>
  );
};

export default PurchaseBox;
