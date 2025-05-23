import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { Button } from "../../components/ui/button";
import { getorderitems, item, inc, dec, deleteitem } from "../../services/home/order";
import { addtowishlist, isexist } from "../../services/home/wishlist";

export default function ShoppingCartPage() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token, setCartCount, cartCount, setWishlistCount, wishlistCount } = appContext;
  const [items, setItems] = useState<item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [paymentotal, setPaymentotal] = useState<number>();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getorderitems(token);
        if (!response) {
          console.log("No response from server.");
          setItems([]);
          return;
        }

        if ("error" in response) {
          setError(response.error);
          setItems([]);
        } else {
          setItems(response);
          setPaymentotal(response[0]?.order?.total || 0);
          console.log("Fetched items response:", response);

          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchItems();
  }, [token]);

  const handleInc = async (e: React.FormEvent, order_item: number) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const response = await inc(token, order_item);

      if ("error" in response) {
        console.log(error);
        setError(response.error);
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === order_item ? { ...item, qte: item.qte + 1, price: Number(item.price) + Number(item.product.prix) } : item
          )
        );
        setPaymentotal(response.order?.total);
        console.log(response);
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleDec = async (e: React.FormEvent, order_item: number) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const response = await dec(token, order_item);

      if ("error" in response) {
        console.log(error);
        setError(response.error);
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === order_item ? { ...item, qte: item.qte - 1, price: Number(item.price) - Number(item.product.prix) } : item
          )
        );
        setPaymentotal(response.order?.total);
        console.log(response);
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleDelete = async (e: React.FormEvent, order_item: number) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const response = await deleteitem(token, order_item);

      if ("error" in response) {
        console.log(error);
        setError(response.error);
      } else {
        //Keep all items except the one whose id matches the deleted item's id.
        setItems((prevItems) => prevItems.filter((item) => item.id !== order_item));
        setPaymentotal(response.order?.total);
        setCartCount(cartCount - 1);
        console.log(response);
        setError(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleMovetoWishlist = async (e: React.FormEvent, product_id: number) => {
    e.preventDefault();
    setError(""); // Reset previous error

    try {
      const result = await isexist(token, product_id);
      if ("error" in result) {
        console.log(result.error);
        setError(result.error);
        return;
      }

      if (!result.exists) {
        //handleDelete(e, order_item);
        //setCartCount(cartCount - 1);
        setWishlistCount(wishlistCount + 1);
        const response = await addtowishlist(token, { product_id });

        if ("error" in response) {
          console.log(error);
          setError(response.error);
        } else {
          //setItems((prevItems) => prevItems.filter((item) => item.product.id !== product_id));
          console.log(response);
          setError(null);
        }
      } else {
        console.log("this product is already in the wishlist");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + Number(item.price), 0);
    setPaymentotal(total);
  }, [items]);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 p-6 md:p-10">
      {/* Left section - Items */}
      <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
        <p className="font-semibold mb-4">
          {items.length} Product{items.length > 1 ? "s" : ""} in Cart
        </p>

        {error ? (
          <div className="text-red-600 bg-red-100 p-2 rounded-md mt-2">{error}</div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b pb-6">
                {item.product.images?.[0]?.image_url && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.product.images[0].image_url}`}
                    alt={item.product.name}
                    className="w-full md:w-40 h-40 rounded object-cover"
                  />
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{item.product.categorie}</p>

                    <div className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                      <span className="font-semibold text-yellow-500">{item.product.rating}</span>
                      <span className="text-yellow-500">{"★".repeat(Math.round(item.product.rating!))}</span>
                      <span className="text-gray-500">({item.product.reviewcount} reviews)</span>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">
                      {item.product.categorie} • {item.product.stock! > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm mt-2">
                    <Button variant="link" className="text-blue-700 px-0" onClick={(e) => handleDelete(e, item.id!)}>
                      Remove
                    </Button>
                    <Button variant="link" className="text-blue-700 px-0" onClick={(e) => handleMovetoWishlist(e, item.product.id)}>
                      Move to Wishlist
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end min-w-[120px]">
                  <p className="text-base font-bold mb-3">{item.price} DZD</p>
                  <div className="flex items-center justify-center border-2 border-blue-700 rounded-full px-3 py-1 hover:shadow-md transition">
                    <button
                      //className="text-xl font-semibold px-2 hover:text-yellow-600 focus:outline-none"
                      className={`text-xl px-2 ${
                        item.qte == 1 ? "text-gray-400 cursor-not-allowed" : "font-semibold px-2 hover:text-yellow-600 focus:outline-none"
                      }`}
                      onClick={(e) => handleDec(e, item.id!)}
                      disabled={item.qte == 1}
                    >
                      −
                    </button>
                    <span className="px-2 font-medium text-lg">{item.qte}</span>
                    <button
                      //className="text-xl font-semibold px-2 hover:text-yellow-600 focus:outline-none"
                      className={`text-xl px-2 ${
                        item.qte >= item.product.stock!
                          ? "text-gray-400 cursor-not-allowed"
                          : "font-semibold px-2 hover:text-yellow-600 focus:outline-none"
                      }`}
                      onClick={(e) => handleInc(e, item.id!)}
                      disabled={item.qte >= item.product.stock!}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right section - Summary */}
      <div className="w-full md:w-1/3 mt-8 md:mt-0">
        <div className="bg-white border rounded-md p-6 shadow-md sticky top-24">
          <h4 className="font-bold text-lg mb-4">Order Summary</h4>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base">Total:</p>
            <p className="text-2xl font-bold">{paymentotal} DZD</p>
          </div>
          <Button className="w-full bg-blue-700 hover:bg-blue-700 text-white py-2 text-sm">Proceed to Checkout</Button>
          <p className="text-xs text-gray-500 mt-2 text-center">You won't be charged yet</p>
        </div>
      </div>
    </div>
  );
}
