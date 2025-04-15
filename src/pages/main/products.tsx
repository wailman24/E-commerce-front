/* import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button"; */
import { useContext, useEffect, useState } from "react";
import { getallvalidproducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import Prodcards from "../../components/home/prodcards";
export default function Products() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("Products must be used within an AppProvider");
  }
  const { token } = appContext;

  const [vproducts, setVProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  useEffect(() => {
    const fetchVP = async () => {
      try {
        const response = await getallvalidproducts(token);
        if ("error" in response) {
          setError(response.error);
          setVProducts([]);
        } else {
          console.log(response);
          setVProducts(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchVP();
  }, [token]);

  // Apply filters
  const filteredProducts = vproducts.filter((product) => {
    const price = product.prix ?? 0;
    const rating = product.rating ?? 0; // Add real rating field if available
    const isInPriceRange = (minPrice === null || price >= minPrice) && (maxPrice === null || price <= maxPrice);
    const hasMinRating = rating >= minRating;
    const isAvailable = !availableOnly || (product.stock ?? 0) > 0;

    return isInPriceRange && hasMinRating && isAvailable;
  });
  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Best Deals {error && `- ${error}`}</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="block text-sm mb-1">Min Price</label>
          <input
            type="number"
            onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
            className="border rounded px-2 py-1"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Max Price</label>
          <input
            type="number"
            onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
            className="border rounded px-2 py-1"
            placeholder="100000"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Min Rating</label>
          <select value={minRating} onChange={(e) => setMinRating(parseInt(e.target.value))} className="border rounded px-2 py-1">
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}★ & up
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center mt-6">
          <input type="checkbox" checked={availableOnly} onChange={() => setAvailableOnly((prev) => !prev)} className="mr-2" />
          <label>In Stock Only</label>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <Prodcards key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
