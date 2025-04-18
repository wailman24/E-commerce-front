import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { Button } from "../../components/ui/button";
import { getorderitems, item } from "../../services/home/order";
//import { Trash2 } from "lucide-react";

export default function ShoppingCartPage() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const cartItems = [
    {
      id: 1,
      title: "Apache Kafka for absolute beginners",
      instructor: "Prashant Kumar Pandey and 1 other",
      rating: 4.5,
      reviews: "6,490",
      hours: 5,
      lectures: 55,
      level: "All Levels",
      price: 11.99,
      originalPrice: 12.99,
      imageUrl: "https://img-b.udemycdn.com/course/240x135/3142166_a637_3.jpg",
    },
    ...Array.from({ length: 9 }, (_, i) => ({
      id: i + 2,
      title: `Course Title ${i + 2}`,
      instructor: `Instructor ${i + 2}`,
      rating: 4.3 + (i % 3) * 0.1,
      reviews: `${(1000 + i * 123).toLocaleString()}`,
      hours: 3 + i,
      lectures: 40 + i * 2,
      level: i % 2 === 0 ? "Beginner" : "Intermediate",
      price: 9.99 + i,
      originalPrice: 19.99 + i * 2,
      imageUrl: "https://img-b.udemycdn.com/course/240x135/placeholder.jpg",
    })),
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const [items, setItems] = useState<item[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getorderitems(token);
        if ("error" in response) {
          setError(response.error);
          setItems([]);
        } else {
          setItems(response);
          console.log(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchItems();
  }, [token]);
  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 p-6 md:p-10">
      {/* Left section - Items */}
      <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
        <p className="font-semibold mb-4">
          {cartItems.length} Product{cartItems.length > 1 ? "s" : ""} in Cart
        </p>

        {error ? (
          <div>
            <div className="text-red-600 bg-red-100 p-2 rounded-md mt-2">{error}</div>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b pb-6">
                {item.product.images?.[0]?.image_url && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.product.images[0].image_url}`}
                    alt={item.product.name}
                    className="w-full md:w-48 h-auto rounded object-cover"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-snug mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.product.category_id}</p>

                  <div className="text-sm text-gray-700 flex items-center gap-2 mb-2">
                    <span className="font-semibold text-yellow-500">{item.product.rating}</span>
                    <span className="text-yellow-500">{"★".repeat(Math.round(item.product.rating))}</span>
                    <span className="text-gray-500">({/* {item.reviews} */} reviews)</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {item.product.category_id} • {item.product.stock! > 0 ? "In Stock" : "Out of Stock"}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-2">
                    <Button variant="link" className="text-purple-600 px-0">
                      Remove
                    </Button>
                    <Button variant="link" className="text-purple-600 px-0">
                      Save for Later
                    </Button>
                    <Button variant="link" className="text-purple-600 px-0">
                      Move to Wishlist
                    </Button>
                  </div>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-base font-bold">€{item.price}</p>
                  <p className="text-sm line-through text-gray-400">€{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right section - Summary */}
      <div className="w-full md:w-1/3 mt-8 md:mt-16">
        <div className="bg-white border rounded-md p-6 shadow-sm sticky top-24">
          <h4 className="font-bold text-lg mb-4">Total:</h4>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-2xl font-bold">€{total.toFixed(2)}</p>
            <p className="line-through text-gray-400 text-sm">€{(total * 1.08).toFixed(2)}</p>
          </div>
          <p className="text-sm text-green-600 mb-4">8% off</p>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm">Proceed to Checkout</Button>
          <p className="text-xs text-gray-500 mt-2">You won't be charged yet</p>
        </div>
      </div>
    </div>
  );
}
