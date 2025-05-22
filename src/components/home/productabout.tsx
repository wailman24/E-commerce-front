import React, { useState } from "react";
import { product } from "../../services/home/product";

type ProductDetailsProps = {
  product: product | undefined;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(product?.images?.[0]?.image_url || null);

  if (!product) {
    return <p className="text-gray-400 italic">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
      {/* Left - Image Gallery */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]">
          {product.images?.map((img) => (
            <img
              key={img.id}
              src={`http://127.0.0.1:8000/storage/${img.image_url}`}
              alt="Thumbnail"
              onClick={() => setSelectedImage(img.image_url)}
              className={`w-16 h-16 object-cover rounded border-2 cursor-pointer ${
                selectedImage === img.image_url ? "border-blue-600" : "border-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="flex-1">
          {selectedImage ? (
            <img
              src={`http://127.0.0.1:8000/storage/${selectedImage}`}
              alt="Main"
              className="w-full h-[350px] object-contain border rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-[350px] flex items-center justify-center border rounded-lg bg-gray-100 text-gray-500">
              No image selected
            </div>
          )}
        </div>
      </div>

      {/* Right - Product Info */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg text-blue-600 font-semibold mb-2">{product.prix} DZD</p>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="text-yellow-500 mr-2">★ {product.rating?.toFixed(1)}</span>
          <span>({product.reviewcount} reviews)</span>
        </div>

        <p className="text-gray-800 mb-6 whitespace-pre-line">{product.about}</p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Category:</strong> {product.categorie}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
          <p>
            <strong>Sold:</strong> {product.total_sold}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
