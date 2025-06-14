import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { getcontentbasedproducts, getproduct, product } from "../../services/home/product";
import ProductDetails from "../../components/home/productabout";
import PurchaseBox from "../../components/home/purchasebox";
import RecommendedProducts from "../../components/home/recommendeprod";
import { useParams } from "react-router-dom";
import ProductReviews from "../../components/home/Reviews";
import { getreviews, review } from "../../services/home/reviews";

export default function ProductPage() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [productData, setProductData] = useState<product>();
  const [recommended, setRecommended] = useState<product[]>([]);
  const [reviews, setReviews] = useState<review[]>([]);
  const params = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getproduct(token, Number(params.id));
        if (!("error" in response)) {
          setProductData(response);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const fetchRecommended = async () => {
      try {
        const rec = await getcontentbasedproducts(token, Number(params.id));
        if (!("error" in rec)) {
          setRecommended(rec.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch recommended products:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const rec = await getreviews(token, Number(params.id));
        if (!("error" in rec)) {
          setReviews(rec);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchProduct();
    fetchRecommended();
    fetchReviews();
  }, [token, params.id]);

  if (!productData) return <p className="text-center text-gray-500 mt-10">Loading product...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Top Section: Description Left, Purchase Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 items-start">
        {/* About + Images + Info */}
        <ProductDetails product={productData} />

        {/* Purchase Box */}
        <div className="sticky top-6 max-w-sm">
          <PurchaseBox price={productData.prix} stock={productData.stock!} />
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts products={recommended} />
      <ProductReviews reviews={reviews} />
    </div>
  );
}
