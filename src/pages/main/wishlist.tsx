// Wishlist.tsx
import Prodcards from "../../components/home/prodcards";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { getwishlist, wishlist } from "../../services/home/wishlist";
export default function Products() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;

  const [products, setProducts] = useState<wishlist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchP = async () => {
      try {
        const response = await getwishlist(token);
        if ("error" in response) {
          setError(response.error);
          setProducts([]);
        } else {
          setProducts(response);

          console.log(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchP();
  }, [token]);

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Wishlist {error && `- ${error}`}</h2>

      <div className="flex gap-6">
        {/* Products Grid */}
        <div className="w-full sm:w-3/4">
          {products.length === 0 ? (
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
