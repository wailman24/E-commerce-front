import { Button } from "../../components/ui/button";
import { useContext, useEffect, useState } from "react";
import { getcolaborativeproducts, getpopularproducts, product } from "../../services/home/product";
import { AppContext } from "../../Context/AppContext";
import { category, popularecatego } from "../../services/home/category";
import Prodcards from "../../components/home/prodcards";
import { Skeleton } from "../../components/ui/skeleton";

export default function HomePage() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("HomePage must be used within an AppProvider");

  const { token, user } = appContext;

  const [popularProducts, setPopularProducts] = useState<product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<product[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(true);
  const [loadingRecommended, setLoadingRecommended] = useState<boolean>(true);

  // Fetch popular categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await popularecatego(token);
        if (response && "error" in response) {
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
      setLoadingPopular(true);
      try {
        const response = await getpopularproducts(token);
        if ("error" in response) {
          setError(response.error);
          setPopularProducts([]);
        } else if (Array.isArray(response)) {
          setPopularProducts(response.slice(0, 5));
        }
      } catch {
        setError("Server error");
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopularProducts();
  }, [token]);

  // Fetch collaborative recommendations
  useEffect(() => {
    if (!user || !token) return;

    const fetchRecommended = async () => {
      setLoadingRecommended(true);
      try {
        const response = await getcolaborativeproducts(token, user.id);
        if ("error" in response) {
          setRecommendedProducts([]);
        } else if (Array.isArray(response)) {
          setRecommendedProducts(response.slice(0, 5));
        }
      } catch {
        setError("Server error");
      } finally {
        setLoadingRecommended(false);
      }
    };
    fetchRecommended();
  }, [token, user]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Next Tech Upgrade Awaits</h1>
        <p className="text-lg md:text-xl mb-6">Find the best deals on the latest phones, laptops, and gadgets.</p>
        <Button className="text-lg px-8 py-4">Shop Now</Button>
      </section>

      {/* Features */}
      <section className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Fast Shipping", description: "Get your orders quickly anywhere in Algeria." },
            { icon: "💰", title: "Best Offers", description: "Exclusive deals on top electronics." },
            { icon: "🔒", title: "Secure Payments", description: "Your transactions are safe and encrypted." },
            { icon: "📞", title: "24/7 Support", description: "We’re here to help anytime, any day." },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 text-center flex flex-col items-center gap-2"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-gray-100 rounded-2xl p-6 h-32 text-center flex flex-col justify-center items-center shadow hover:shadow-md min-w-[180px] flex-1"
              >
                <p className="text-lg font-semibold">{cat.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 w-full text-center">No data available.</p>
          )}
        </div>
      </section>

      {/* Popular Products */}
      <section className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-6">Best Deals</h2>
        {loadingPopular ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : popularProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularProducts.map((p) => (
              <Prodcards key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>

      {/* Personalized Products */}
      <section className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-6">For You</h2>
        {loadingRecommended ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : recommendedProducts.length === 0 ? (
          <p className="text-center text-gray-500">No personalized recommendations available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedProducts.map((p) => (
              <Prodcards key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-12 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">About Us</h3>
            <p className="text-sm">
              We are a leading Algerian e-commerce platform providing the best deals on electronics. Fast delivery, secure payment, and top
              customer service — that’s our promise.
            </p>
          </div>
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
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
            <p className="text-sm">Email: support@yourstore.dz</p>
            <p className="text-sm">Phone: +213 123 456 789</p>
            <p className="text-sm">Algiers, Algeria</p>
          </div>
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
