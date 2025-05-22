import React from 'react';

type Image = {
  url: string;
};

type Product = {
  id: number;
  name: string;
  categorie?: string;
  about: string;
  prix: number;
  stock: number;
  is_valid: boolean;
  seller_id: number;
  total_sold: number;
  images: Image[];
  reviewcount: number;
  rating: number;
};

type ProductDetailsProps = {
  product: Product;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left side - Product Images */}
      <div className="space-y-4">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`Product image ${index + 1}`}
            className="w-full rounded-xl shadow"
          />
        ))}
      </div>

      {/* Right side - Product Info */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-blue-600 font-semibold mb-2">{product.prix} DZD</p>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="text-yellow-500 mr-2">★ {product.rating.toFixed(1)}</span>
          <span>({product.reviewcount} reviews)</span>
        </div>

        <p className="text-gray-800 mb-6 whitespace-pre-line">{product.about}</p>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Category:</strong> {product.categorie || 'N/A'}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Sold:</strong> {product.total_sold}</p>
        </div>

        <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
