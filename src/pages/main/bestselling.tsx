import { useContext, useEffect, useState } from "react";
import { getBestDealsProducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import Prodcards from "../../components/home/prodcards";
import { Skeleton } from "../../components/ui/skeleton";

export default function Bestselling() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;

  const [vproducts, setVProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchVP = async () => {
      try {
        setLoading(true);
        const response = await getBestDealsProducts(token);

        if (response && "error" in response) {
          setError(response.error);
          setVProducts([]);
        } else {
          const allProducts = Array.isArray(response) ? response : [response];
          setVProducts(allProducts);
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
  }, [token]);

  const categories = Array.from(new Set(vproducts.map((p) => p.categorie).filter(Boolean)));

  const filteredProducts = vproducts.filter((product) => {
    const price = product.prix ?? 0;
    const rating = product.rating ?? 0;
    const stock = product.stock ?? 0;
    const name = product.name?.toLowerCase() ?? "";
    const category = product.categorie ?? "";

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    const matchPrice = price >= min && price <= max;
    const matchRating = rating >= minRating;
    const matchStock = !availableOnly || stock > 0;
    const matchName = name.includes(searchName.toLowerCase());
    const matchCategory = selectedCategory === "All" || category === selectedCategory;

    return matchPrice && matchRating && matchStock && matchName && matchCategory;
  });

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Best Deals {error && `- ${error}`}</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full sm:w-1/4 border rounded p-4 bg-white shadow space-y-4">
          <h3 className="text-lg font-semibold">Filter Products</h3>

          {/* Price Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Min Price (DZD)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="0"
            />
            <label className="block text-sm font-medium text-gray-700">Max Price (DZD)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="100000"
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value={0}>Any</option>
              <option value={1}>1★ and up</option>
              <option value={2}>2★ and up</option>
              <option value={3}>3★ and up</option>
              <option value={4}>4★ and up</option>
              <option value={5}>5★ only</option>
            </select>
          </div>

          {/* In-stock only */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label className="text-sm text-gray-700">In Stock Only</label>
          </div>

          {/* Name Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Search by Name</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Search product name..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="All">All</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat!}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setMinRating(0);
              setAvailableOnly(false);
              setSearchName("");
              setSelectedCategory("All");
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-1.5 rounded"
          >
            Reset Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="w-full sm:w-3/4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Prodcards key={product.id ?? `product-${product.name}`} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
