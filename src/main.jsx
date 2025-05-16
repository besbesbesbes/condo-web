import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Register service worker for PWA updates
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true); // Auto-refresh when new SW is ready
  },
  onOfflineReady() {
    console.log("App ready for offline use");
  },
});

createRoot(document.getElementById("root")).render(<App />);
