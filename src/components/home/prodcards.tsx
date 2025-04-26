import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { product } from "../../services/home/product";
/* import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet"; */
import { addorderitem, isexistincart } from "../../services/home/order";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { addtowishlist, isexist } from "../../services/home/wishlist";

export default function Prodcards({ id, name, images, prix, total_sold }: product) {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token, setWishlistCount, wishlistCount, setCartCount, cartCount } = appContext;
  const [error, setError] = useState<string | null>(null);
  const [exist, setExist] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const check = await isexistincart(token, id);

      console.log("check:", exist);
      const response = await addorderitem(token, { product_id: id });

      if (response && "error" in response) {
        console.log(error);
        //setCartCount(cartCount + 1);
        setError(response.error);
      } else {
        console.log(response);
        if ("exists" in check && check.exists === false) {
          setCartCount(cartCount + 1); // correct increment
        }
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleAddTowishlist = async () => {
    setError(""); // Reset previous error
    //setOptimisticExist((prev) => (prev === null ? !exist : !prev));

    const newState = !exist;
    setExist(newState);
    if (!exist) {
      const newcount = wishlistCount + 1;
      setWishlistCount(newcount);
    } else {
      const newcount = wishlistCount - 1;
      setWishlistCount(newcount);
    }

    try {
      const response = await addtowishlist(token, { product_id: id });

      if ("error" in response) {
        console.log(error);
        setExist(newState);
        //setWishlistCount((count) => newState ? count - 1 : count + 1);
        setError(response.error);
      } else {
        console.log(response);

        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");

      console.error(err);
    }
  };

  useEffect(() => {
    const checkExistence = async () => {
      setError(""); // Reset previous error

      try {
        const response = await isexist(token, id);

        if (response && "error" in response) {
          console.log(response.error);
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

  useEffect(() => {
    console.log("Exist changed:", exist);
  }, [exist]);
  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <div key={id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-left">
          {/* Product Image with Actions */}
          <div className="relative w-full h-40">
            {images?.[0]?.image_url && (
              <img src={`http://127.0.0.1:8000/storage/${images[0].image_url}`} alt={name} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8" onClick={handleAddTowishlist}>
                {exist ? (
                  <Heart fill="#ef4444" color="#ef4444" className="w-4 h-4 transition-all" />
                ) : (
                  <Heart fill="none" color="#9ca3af" className="w-4 h-4 transition-all" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
                <Eye className="w-4 h-4 text-gray-700" />
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

            <Button variant="outline" onClick={handleAddToCart} className="w-full mt-2 text-sm flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </Button>
            {/* Add to Cart Sheet */}
          </div>
        </div>
      )}
    </>
  );
}
