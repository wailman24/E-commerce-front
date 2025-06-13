import { Button } from "../../components/ui/button";
import { useContext, useEffect, useState } from "react";
import { getcolaborativeproducts, getpopularproducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import { category, popularecatego } from "../../services/home/category";
import Prodcards from "../../components/home/prodcards";

export default function HomePage() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("HomePage must be used within an AppProvider");
  }
  const { token, user } = appContext;

  const [popularProducts, setPopularProducts] = useState<product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<product[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch popular categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await popularecatego(token);
        if (response && "error" in response) {
          console.error(response.error);
          setCategories([]);
        } else {
          setCategories(response);
        }
      } catch (err) {
        console.error("Error loading popular categories", err);
      }
    };
    fetchCategories();
  }, [token]);

  // Fetch popular products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      setLoading(true);
      try {
        const response = await getpopularproducts(token);
        if (response && "error" in response) {
          setError(response.error);
          setPopularProducts([]);
        } else if (Array.isArray(response)) {
          const topFive = response.slice(0, 5);
          setPopularProducts(topFive);
          setError(null);
        } else {
          console.warn("Unexpected response format for popular products:", response);
          setPopularProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch popular products:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, [token]);

  // Fetch collaborative recommendations
  useEffect(() => {
    if (!user || !token) return;

    const fetchCollaborativeProducts = async () => {
      setLoading(true);
      try {
        const response = await getcolaborativeproducts(token, user.id);
        if (response && "error" in response) {
          setError(response.error);
          setRecommendedProducts([]);
        } else if (Array.isArray(response)) {
          const topFive = response.slice(0, 5);
          setRecommendedProducts(topFive);
          setError(null);
        } else {
          console.warn("Unexpected response format for recommendations:", response);
          setRecommendedProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch collaborative products:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborativeProducts();
  }, [token, user]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Next Tech Upgrade Awaits</h1>
        <p className="text-lg md:text-xl mb-6">Find the best deals on the latest phones, laptops, and gadgets.</p>
        <Button className="text-lg px-8 py-4">Shop Now</Button>
      </section>

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
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-100 rounded-2xl p-6 h-32 text-center flex flex-col justify-center items-center shadow hover:shadow-md transition flex-1 min-w-[180px]"
              >
                <p className="text-lg font-semibold">{category.name}</p>
              </div>
            ))
          ) : (
            <p className="text-center w-full text-gray-500">No data available.</p>
          )}
        </div>
      </section>

      {/* Best Deals */}
      <section className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-6">Best Deals</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading deals...</p>
        ) : popularProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularProducts.map((product) => (
              <Prodcards key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* For You */}
      <section className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-6">For You</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading personalized products...</p>
        ) : recommendedProducts.length === 0 ? (
          <p className="text-center text-gray-500">No personalized recommendations available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedProducts.map((product) => (
              <Prodcards key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
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
