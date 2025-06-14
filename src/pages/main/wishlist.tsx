import Prodcards from "../../components/home/prodcards";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { getwishlist, wishlist } from "../../services/home/wishlist";
import { Skeleton } from "../../components/ui/skeleton";

export default function Wishlist() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Wishlist must be used within an AppProvider");

  const { token } = appContext;

  const [products, setProducts] = useState<wishlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchP = async () => {
      setIsLoading(true); // 👈 start loading
      try {
        const response = await getwishlist(token);
        if ("error" in response) {
          setError(response.error);
          setProducts([]);
        } else {
          setProducts(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false); // 👈 done loading
      }
    };

    fetchP();
  }, [token]);

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Wishlist {error && `- ${error}`}</h2>

      <div className="flex gap-6">
        <div className="w-full sm:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-3 rounded-xl shadow-md space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p>Your Wishlist Is Empty.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Prodcards key={product.product.id} {...product.product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
