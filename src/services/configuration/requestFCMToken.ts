// src/utils/requestFCMToken.ts
//import { getToken } from "firebase/messaging";
//import { messaging } from "../home/firebase";
//import { messaging } from "./firebase";

export async function requestFCMToken(fcmToken: string, authToken: string) {
  try {
    console.log("✅ Got FCM Token:", fcmToken);

    // Ensure CSRF token for Sanctum
    await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });

    const response = await fetch("http://127.0.0.1:8000/api/save-fcm-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcm_token: fcmToken }),
      credentials: "include", // 🛡️ include this for sanctum
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to save FCM token");
    console.log("✅ FCM token saved:", data);
  } catch (err) {
    console.error("❌ Error saving FCM token:", err);
  }
}
