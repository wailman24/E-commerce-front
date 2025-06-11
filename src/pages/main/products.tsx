import { useContext, useEffect, useState } from "react";
import { getallvalidproducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import Prodcards from "../../components/home/prodcards";

export default function Products() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;

  const [vproducts, setVProducts] = useState<product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const fetchVP = async () => {
      try {
        setLoading(true);
        const response = await getallvalidproducts(token, currentPage);

        if ("error" in response) {
          setError(response.error);
          setVProducts([]);
        } else {
          setVProducts(response.data);
          setLastPage(response.meta.last_page);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVP();
  }, [token, currentPage]);

  // Filter logic
  const filteredProducts = vproducts.filter((product) => {
    const price = product.prix ?? 0;
    const rating = product.rating ?? 0;
    const stock = product.stock ?? 0;

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    const inPriceRange = price >= min && price <= max;
    const meetsRating = rating >= minRating;
    const inStock = !availableOnly || stock > 0;

    return inPriceRange && meetsRating && inStock;
  });

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Best Deals {error && `- ${error}`}</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Filter Panel */}
        <div className="w-full sm:w-1/4 border rounded p-4 bg-white shadow space-y-4">
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

        {/* Product Grid */}
        <div className="w-full sm:w-3/4">
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Prodcards key={product.id} {...product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {lastPage}
              </span>
              <button
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
