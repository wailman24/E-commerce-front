import React from "react";
import { product } from "../../services/home/product";
import Prodcards from "./prodcards";

type RecommendedProductsProps = {
  products: product[];
};

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <Prodcards key={prod.id} {...prod} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
