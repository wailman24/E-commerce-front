import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { product } from "../../services/home/product";
import { addorderitem, isexistincart } from "../../services/home/order";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { addtowishlist, isexist } from "../../services/home/wishlist";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/ui/skeleton";

export default function Prodcards({ id, name, images, prix, total_sold, rating }: product) {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token, setWishlistCount, wishlistCount, setCartCount, cartCount, isAuthenticated } = appContext;

  const [error, setError] = useState<string | null>(null);
  const [exist, setExist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistence = async () => {
      setError("");
      try {
        const response = await isexist(token, id);
        if (response && "exists" in response) setExist(response.exists);
        else if ("error" in response) setError(response.error);
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkExistence();
  }, [id, token]);

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

  const handleAddTowishlist = async () => {
    if (!isAuthenticated) return navigate("/login");
    setError("");

    try {
      const response = await addtowishlist(token, { product_id: id });
      if ("error" in response) {
        setError(response.error);
      } else {
        const newState = !exist;
        setExist(newState);
        setWishlistCount(newState ? wishlistCount + 1 : wishlistCount - 1);
      }
    } catch {
      setError("An unexpected error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-md space-y-3">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-left">
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
