import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppProvider from "./Context/AppContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AppProvider>
);

// Register Firebase service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registered:", registration);
    })
    .catch((err) => {
      console.error("❌ Service Worker registration failed:", err);
    });
}
