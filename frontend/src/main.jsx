// main.jsx or index.js
import React from "react";
import { createRoot } from "react-dom/client"; // ✅ correct import
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
