//import React from "react";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { useContext, useEffect, useState } from "react";
import { getbestdealsproducts, product } from "../services/home/product";
import { AppContext } from "../Context/AppContext";

export default function HomePage() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("SignupForm must be used within an AppProvider");
  }
  const { token } = appContext;

  const [bdproducts, setBDProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBDP = async () => {
      try {
        const response = await getbestdealsproducts(token);
        //console.log("Fetched User Data:", user);
        if ("error" in response) {
          setError(response.error);

          setBDProducts([]);
        } else {
          setBDProducts(response);
          console.log(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchBDP();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Next Tech Upgrade Awaits</h1>
        <p className="text-lg md:text-xl mb-6">Find the best deals on the latest phones, laptops, and gadgets.</p>
        <Button className="text-lg px-8 py-4">Shop Now</Button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <p className="font-semibold">Fast Shipping</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <p className="font-semibold">Best Offers</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <p className="font-semibold">Secure Payments</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <p className="font-semibold">24/7 Support</p>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="font-medium">Smartphones</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="font-medium">Laptops</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="font-medium">Accessories</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="font-medium">Gaming</p>
          </div>
        </div>
      </section>

      {/* Best Deals */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">Best Deals {error}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bdproducts.map((product) => {
            console.log(
              "Product image:",
              product.images?.[0]?.image_url,
              " product_name",
              product.name,
              "image_count:",
              product.images?.length
            ); // Debugging product image data
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-0 overflow-hidden text-left">
                <div className="relative">
                  {/*  <img
                    // Fix the <img> tag code:
                    src={product.image?.length > 0 ? `http://localhost:8000/storage/${product.image[0].image_url}` : "123"}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  /> */}
                  {product.images?.[0]?.image_url && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.images[0].image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-gray-500 text-sm">{product.prix} DZD</p>
                  <Button variant="outline" className="w-full mt-2 text-sm flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
