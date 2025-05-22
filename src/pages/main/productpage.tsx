import ProductDetails from "../../components/home/productabout";

const product = {
  id: 1,
  name: "iPhone 16",
  categorie: "Smartphones",
  about: "The latest iPhone with AI-powered camera and performance boost.",
  prix: 25000,
  stock: 10,
  is_valid: true,
  seller_id: 3,
  total_sold: 5,
  images: [{ url: "/images/iphone-front.jpg" }, { url: "/images/iphone-back.jpg" }],
  reviewcount: 8,
  rating: 4.6,
};

export default function ProductPage() {
  return <ProductDetails product={product} />;
}
