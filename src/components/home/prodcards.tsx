import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { product } from "../../services/home/product";
import { addorderitem, isexistincart } from "../../services/home/order";
import { useState, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { addtowishlist, getwishlist } from "../../services/home/wishlist";
import { Link, useNavigate } from "react-router-dom";
//import { Skeleton } from "../../components/ui/skeleton";

export default function Prodcards({ id, name, images, prix, total_sold, rating }: product) {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token, setWishlistCount, setWishlistItems, wishlistItems, cartCount, setCartCount, isAuthenticated } = appContext;

  const [error, setError] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();

  const exist = wishlistItems.includes(id);

  const refreshWishlist = async () => {
    const updated = await getwishlist(token);
    if (!("error" in updated)) {
      setWishlistCount(updated.length);
      setWishlistItems(updated.map((item) => item.product.id));
    }
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    setError("");
    setCartLoading(true);

    try {
      const check = await isexistincart(token, id);
      const response = await addorderitem(token, { product_id: id });

      if ("error" in response) {
        setError(response.error);
      } else {
        if ("exists" in check && check.exists === false) {
          setCartCount(cartCount + 1);
        }
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) return navigate("/login");
    setError("");
    setWishlistLoading(true);

    try {
      const response = await addtowishlist(token, { product_id: id });
      if ("error" in response) {
        setError(response.error);
      } else {
        await refreshWishlist();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-left">
      <div className="relative w-full h-40">
        <img
          src={images?.[0]?.image_url ? `http://127.0.0.1:8000/storage/${images[0].image_url}` : "/placeholder-image.jpg"}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full shadow w-8 h-8"
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
          >
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

      <div className="p-3 space-y-1">
        <p className="font-medium text-sm truncate">{name}</p>
        <div className="flex items-center text-sm text-gray-600">
          <span className="text-yellow-500 mr-1">★ {rating?.toFixed(1) ?? "0.0"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{prix} DZD</span>
        </div>
        <p className="text-green-600 text-xs">{total_sold || 0} sold</p>
        <Button
          variant="outline"
          onClick={handleAddToCart}
          className="w-full mt-2 text-sm flex items-center justify-center gap-2"
          disabled={cartLoading}
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
