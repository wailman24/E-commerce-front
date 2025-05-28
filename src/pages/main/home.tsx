import { Eye, ShoppingCart, Heart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useContext, useEffect, useState } from "react";
import { getbestdealsproducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import { category, popularecatego } from "../../services/home/category";

export default function HomePage() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("HomePage must be used within an AppProvider");
  }
  const { token } = appContext;

  const [bdproducts, setBDProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<category[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await popularecatego(token);
        if (response && "error" in response) {
          console.error(response.error);
          setCategories([]);
        } else {
          setCategories(response);
          console.log("Fetched categories response:", response);
        }
      } catch (err) {
        console.error("Error loading popular categories", err);
      }
    };

    fetchCategories();
  }, [token]);
  useEffect(() => {
    const fetchBDP = async () => {
      setLoading(true);
      try {
        const response = await getbestdealsproducts(token);
        if ("error" in response) {
          setError(response.error);
          setBDProducts([]);
        } else {
          setBDProducts(response);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchBDP();
  }, [token]);

  const renderRating = (count: number = 0) => {
    const fullStars = "★".repeat(count);
    const emptyStars = "☆".repeat(5 - count);
    return <div className="text-yellow-500 text-sm">{fullStars + emptyStars}</div>;
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Next Tech Upgrade Awaits</h1>
        <p className="text-lg md:text-xl mb-6">Find the best deals on the latest phones, laptops, and gadgets.</p>
        <Button className="text-lg px-8 py-4">Shop Now</Button>
      </section>

      {/* Features Section */}
      {/* Features Section */}
      <section className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Fast Shipping",
              icon: "🚚",
              description: "Get your orders quickly anywhere in Algeria.",
            },
            {
              title: "Best Offers",
              icon: "💰",
              description: "Exclusive deals on top electronics.",
            },
            {
              title: "Secure Payments",
              icon: "🔒",
              description: "Your transactions are safe and encrypted.",
            },
            {
              title: "24/7 Support",
              icon: "📞",
              description: "We’re here to help anytime, any day.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white shadow-sm hover:shadow-md transition rounded-2xl p-6 text-center flex flex-col items-center gap-2"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="w-full px-6">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="flex flex-wrap gap-4 w-full">
          {categories?.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-100 rounded-2xl p-6 h-32 text-center flex flex-col justify-center items-center shadow hover:shadow-md transition flex-1 min-w-[180px]"
              >
                <p className="text-lg font-semibold">{category.name}</p>
                {/*                 <p className="text-sm text-gray-600">{category.total_qte} sold</p>
                 */}{" "}
              </div>
            ))
          ) : (
            <p className="text-center w-full text-gray-500">No data available.</p>
          )}
        </div>
      </section>

      {/* Best Deals */}
      <section className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-6">Best Deals {error && <span className="text-red-500"> - {error}</span>}</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading deals...</p>
        ) : bdproducts.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bdproducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-left">
                <div className="relative w-full h-40">
                  {product.images?.[0]?.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.images[0].image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-xs text-blue-600">{product.categorie || "Brand Ltd"}</p>
                  <p className="font-medium text-sm truncate">{product.name}</p>

                  {renderRating(product.rating || 0)}

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{product.prix} DZD</span>
                  </div>

                  <p className="text-green-600 text-xs">{product.total_sold || 0} sold</p>

                  <Button variant="outline" className="w-full mt-2 text-sm flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer / About Section */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-12 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">About Us</h3>
            <p className="text-sm">
              We are a leading Algerian e-commerce platform providing the best deals on electronics. Fast delivery, secure payment, and top
              customer service — that’s our promise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/shop" className="hover:text-white">
                  Shop
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-white">
                  Categories
                </a>
              </li>
              <li>
                <a href="/deals" className="hover:text-white">
                  Best Deals
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
            <p className="text-sm">Email: support@yourstore.dz</p>
            <p className="text-sm">Phone: +213 123 456 789</p>
            <p className="text-sm">Algiers, Algeria</p>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">
                Facebook
              </a>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
              <a href="#" className="hover:text-white">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm mt-12 border-t border-gray-700 pt-6">
          &copy; {new Date().getFullYear()} Shop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
