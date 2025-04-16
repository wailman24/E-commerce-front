import { useContext, useEffect, useState } from "react";
import { getallvalidproducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import Prodcards from "../../components/home/prodcards";

export default function Products() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;

  const [vproducts, setVProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
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
          setVProducts(response);
          console.log(response);
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
    const rating = product.rating ?? 0;
    const stock = product.stock ?? 0;

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    const isInPriceRange = price >= min && price <= max;
    const hasMinRating = rating >= minRating;
    const isAvailable = !availableOnly || stock > 0;

    return isInPriceRange && hasMinRating && isAvailable;
  });

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Best Deals {error && `- ${error}`}</h2>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-full sm:w-1/4 border rounded p-4 space-y-4 bg-white shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Min Rating</label>
            <select value={minRating} onChange={(e) => setMinRating(parseInt(e.target.value))} className="w-full border rounded px-2 py-1">
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}★ & up
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input type="checkbox" checked={availableOnly} onChange={() => setAvailableOnly((prev) => !prev)} className="mr-2" />
            <label>In Stock Only</label>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full sm:w-3/4">
          {filteredProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Prodcards key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
