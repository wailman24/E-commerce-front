import { ref, push } from "firebase/database";
import { database } from "../../services/home/firebase"; // adjust path based on your structure

export const notifyAdmin = async (productName: string) => {
  await push(ref(database, "notifications"), {
    title: "🆕 New Product Added",
    message: `${productName} was added by a seller.`,
    timestamp: Date.now(),
  });
};

export const sendPushNotification = async (productId: number, productName: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/send-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        product_name: productName,
      }),
    });

    const result = await response.json();
    console.log("✅ Push Notification Sent:", result);
  } catch (error) {
    console.error("❌ Failed to send push notification:", error);
  }
};
