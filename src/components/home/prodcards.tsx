import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { product } from "../../services/home/product";
import { addorderitem, isexistincart } from "../../services/home/order";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { addtowishlist, isexist } from "../../services/home/wishlist";
import { Link } from "react-router-dom";

export default function Prodcards({ id, name, images, prix, total_sold }: product) {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token, setWishlistCount, wishlistCount, setCartCount, cartCount } = appContext;

  const [error, setError] = useState<string | null>(null);
  const [exist, setExist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCartLoading(true);

    try {
      const check = await isexistincart(token, id);
      const response = await addorderitem(token, { product_id: id });

      if (response && "error" in response) {
        setError(response.error);
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

  const handleAddTowishlist = async () => {
    setError("");

    try {
      const response = await addtowishlist(token, { product_id: id });

      if ("error" in response) {
        setError(response.error);
      } else {
        const newState = !exist;
        setExist(newState);
        setWishlistCount(newState ? wishlistCount + 1 : wishlistCount - 1);
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  useEffect(() => {
    const checkExistence = async () => {
      setError("");

      try {
        const response = await isexist(token, id);

        if (response && "error" in response) {
          setError(response.error);
          setExist(false);
        } else if ("exists" in response) {
          setExist(response.exists);
          setError(null);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkExistence();
  }, [id, token]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div key={id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-left">
          {/* Product Image with Actions */}
          <div className="relative w-full h-40">
            <img
              src={images?.[0]?.image_url ? `http://127.0.0.1:8000/storage/${images[0].image_url}` : "/placeholder-image.jpg"}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8" onClick={handleAddTowishlist}>
                {exist ? (
                  <Heart fill="#ef4444" color="#ef4444" className="w-4 h-4 transition-all" />
                ) : (
                  <Heart fill="none" color="#9ca3af" className="w-4 h-4 transition-all" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
                <Link to={`/product/about/${id}`}>
                  <Eye className="w-4 h-4 text-gray-700" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-3 space-y-1">
            <p className="font-medium text-sm truncate">{name}</p>

            {/* Rating */}
            <div className="flex text-yellow-500 text-sm">{"★".repeat(0).padEnd(5, "☆")}</div>

            {/* Pricing */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{prix} DZD</span>
            </div>

            {/* Sold Count */}
            <p className="text-green-600 text-xs">{total_sold || 0} sold</p>

            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="w-full mt-2 text-sm flex items-center justify-center gap-2"
              disabled={cartLoading}
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </Button>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
